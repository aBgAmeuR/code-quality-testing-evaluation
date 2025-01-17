"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { log } from "@repo/logger";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";

import { getUsers } from "~/services/api";
import { User } from "~/types";
import { isAuthenticated } from "~/utils/auth";

interface ExtendUser extends User {
  searchableText?: string;
  joinedDate?: Date;
  joinedCategory?: string;
  fullName?: string;
  initials?: string;
}

const UserList = () => {
  const [users, setUsers] = useState<ExtendUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [joinedFilter, setJoinedFilter] = useState<string>("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        const processedUsers: ExtendUser[] = data.map((user: User) => ({
          ...user,
          searchableText: `${user.firstname.toLowerCase()} ${user.lastname.toLowerCase()} ${user.username.toLowerCase()}`,
          joinedDate: new Date(user.created_at),
          joinedCategory: (() => {
            const created = new Date(user.created_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - created.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays < 7 ? "new" : diffDays < 30 ? "recent" : "old";
          })(),
          fullName: `${user.firstname} ${user.lastname}`,
          initials: `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`
        }));
        setUsers(processedUsers);
      } catch (err) {
        setError("Failed to load users");
        log(err);
      }
    };
    fetchUsers();
  }, []);

  const searchUsers = useCallback((user: ExtendUser, term: string): boolean => {
    if (!term) return true;

    const searchWords = term.toLowerCase().split(" ");

    const searchFields = [
      user.searchableText!,
      user.fullName!.toLowerCase(),
      user.initials!.toLowerCase(),
      new Date(user.created_at).toLocaleDateString()
    ];

    return searchWords.every((word) => {
      const searchOptions = searchFields.map((field) => ({
        field,
        weight: field === user.searchableText ? 2 : 1
      }));

      return searchOptions.some((option) => {
        const words = option.field.split(" ");
        return words.some((fieldWord) => {
          const normalizedFieldWord = fieldWord.trim().toLowerCase();
          const normalizedSearchWord = word.trim().toLowerCase();

          if (normalizedFieldWord.includes(normalizedSearchWord)) {
            return true;
          }

          const matrix = Array(normalizedFieldWord.length + 1)
            .fill(null)
            .map(() => Array(normalizedSearchWord.length + 1).fill(null));

          for (let i = 0; i <= normalizedFieldWord.length; i++) {
            matrix[i][0] = i;
          }
          for (let j = 0; j <= normalizedSearchWord.length; j++) {
            matrix[0][j] = j;
          }

          for (let i = 1; i <= normalizedFieldWord.length; i++) {
            for (let j = 1; j <= normalizedSearchWord.length; j++) {
              const cost =
                normalizedFieldWord[i - 1] === normalizedSearchWord[j - 1]
                  ? 0
                  : 1;
              matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
              );
            }
          }

          const maxLength = Math.max(
            normalizedFieldWord.length,
            normalizedSearchWord.length
          );
          const threshold = Math.floor(maxLength * 0.3);
          return (
            matrix[normalizedFieldWord.length][normalizedSearchWord.length] <=
            threshold
          );
        });
      });
    });
  }, []);

  const sortUsers = useCallback(
    (a: User, b: User): number => {
      let compareValueA: string | number, compareValueB: string | number;

      switch (sortField) {
        case "name":
          compareValueA = `${a.firstname}${a.lastname}`.toLowerCase();
          compareValueB = `${b.firstname}${b.lastname}`.toLowerCase();
          break;
        case "username":
          compareValueA = a.username.toLowerCase();
          compareValueB = b.username.toLowerCase();
          break;
        case "joined":
          compareValueA = new Date(a.created_at).getTime();
          compareValueB = new Date(b.created_at).getTime();
          break;
        default:
          compareValueA = a[sortField as keyof User] as string | number;
          compareValueB = b[sortField as keyof User] as string | number;
      }

      if (sortDirection === "asc") {
        return compareValueA < compareValueB
          ? -1
          : compareValueA > compareValueB
            ? 1
            : 0;
      }
      return compareValueB < compareValueA
        ? -1
        : compareValueB > compareValueA
          ? 1
          : 0;
    },
    [sortField, sortDirection]
  );

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const searchMatch = searchUsers(user, searchTerm);

        let joinedMatch = true;
        if (joinedFilter) {
          const now = new Date();
          const userDate = new Date(user.created_at);
          const diffTime = Math.abs(now.getTime() - userDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          switch (joinedFilter) {
            case "week":
              joinedMatch = diffDays <= 7 && user.joinedCategory === "new";
              break;
            case "month":
              joinedMatch = diffDays <= 30 && user.joinedCategory === "recent";
              break;
            case "older":
              joinedMatch = diffDays > 30 && user.joinedCategory === "old";
              break;
            default:
              joinedMatch = true;
          }
        }

        return searchMatch && joinedMatch;
      })
      .sort(sortUsers);
  }, [users, searchTerm, joinedFilter, searchUsers, sortUsers]);

  if (!isAuthenticated()) return router.push("/login");

  return (
    <div className="p-5">
      <h2 className="mb-5">Users</h2>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded border border-gray-300 flex-1"
        />

        <select
          value={joinedFilter}
          onChange={(e) => setJoinedFilter(e.target.value)}
          className="p-2 rounded border border-gray-300"
        >
          <option value="">All Users</option>
          <option value="week">Joined this week</option>
          <option value="month">Joined this month</option>
          <option value="older">Joined earlier</option>
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="p-2 rounded border border-gray-300"
        >
          <option value="name">Sort by Name</option>
          <option value="username">Sort by Username</option>
          <option value="joined">Sort by Join Date</option>
        </select>

        <Button
          onClick={() =>
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          {sortDirection === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      {error ? (
        <div className="text-red-600 p-3 bg-red-100 mb-5 rounded">{error}</div>
      ) : null}

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="border border-gray-300 rounded-lg p-4 bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="mb-1">
                {user.firstname} {user.lastname}
              </h3>
              <p className="text-gray-600">@{user.username}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded text-sm">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-600">
          No users found matching your criteria
        </p>
      )}
    </div>
  );
};

export default UserList;
