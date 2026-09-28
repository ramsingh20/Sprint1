import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Search, Eye, Pencil, Trash2, UserX, UserCheck,} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Avatar, AvatarFallback,} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@material-tailwind/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";

const statusStyles = {
  Active: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  Pending:"bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Inactive:"bg-muted text-muted-foreground",
};

const UsersTable = ({ data, onViewUser, onEditUser, onDeleteUser, onDeactivateUser, onActivateUser, }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [role, setRole] = useState("All");
    const [sortConfig, setSortConfig] = useState({ 
        key: null,
        direction: "asc",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const filteredUsers = useMemo(() => {
        const filtered = data.filter((user) => {
            const searchValue = search.toLowerCase();
            const matchesSearch = user.name.toLowerCase().includes(searchValue) || user.email.toLowerCase().includes(searchValue);
            const matchesStatus = status === "All" || user.status === status;
            const matchesRole = role === "All" || user.role === role;
            return (matchesSearch && matchesStatus && matchesRole);
        });

        if (!sortConfig.key) {
            return filtered;
        }

        return [...filtered].sort((a, b) => {
            const first = a[sortConfig.key];
            const second = b[sortConfig.key];

            const comparison = String(first).localeCompare(
                String(second),
                undefined,
                {
                    numeric: true,
                    sensitivity: "base",
                }
            );

            return sortConfig.direction === "asc" ? comparison : -comparison;
        });
    }, [ data, search, status, role, sortConfig,]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));      // Calculate pagination
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice( startIndex, startIndex + rowsPerPage);

    const handleSort = (key) => {
        setSortConfig((current) => ({ key, direction:
            current.key === key && current.direction === "asc" ? "desc" : "asc",}));
    };

    const SortButton = ({ label, sortKey }) => {
        const isActive = sortConfig.key === sortKey;

        return (
            <button type="button" onClick={() => handleSort(sortKey)} className="inline-flex items-center gap-1.5 font-medium hover:text-foreground">
                {label}
                {!isActive && (<ArrowUpDown className="size-3.5" />)}
                {isActive && sortConfig.direction === "asc" && (
                    <ArrowUp className="size-3.5" />
                )}
                {isActive && sortConfig.direction === "desc" && (<ArrowDown className="size-3.5" />)}
            </button>
        );
    };

    const handleUserAction = (action, user) => {
        if (action === "view") {
            onViewUser(user);
            return;
        }

        if (action === "edit") {
            onEditUser(user);
            return;
        }

        if (action === "delete") {
            onDeleteUser(user);
            return;
        }

        if (action === "deactivate") {
            onDeactivateUser(user);
            return;
        }

        if (action === "activate") {
            onActivateUser(user);
            return;
        }
        console.log(`${action}:`, user);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, status, role]);

    return (
        <Card className="overflow-hidden border border-border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                <h2 className="text-lg font-semibold">Users</h2>
                <p className="mt-1 text-sm text-muted-foreground">Manage users and account access.</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users..." className="h-9 pl-9 sm:w-64" />
                </div>

                <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                <select
                    value={role}
                    onChange={(event) =>setRole(event.target.value)}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <SortButton label="User" sortKey="name" />
                        </TableHead>
                        <TableHead>
                            <SortButton label="Role" sortKey="role" />
                        </TableHead>
                        <TableHead>
                            <SortButton label="Status" sortKey="status" />
                        </TableHead>
                        <TableHead>
                            <SortButton label="Joined" sortKey="joinedDate" />
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedUsers.map((user) => (
                    <TableRow key={user._id}>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell><span className="text-sm">{user.role}</span></TableCell>

                        <TableCell>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[user.status]}`}>
                                {user.status}
                            </span>
                        </TableCell>

                        <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>

                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted">
                                        <MoreHorizontal className="size-4" />
                                        <span className="sr-only">Open user actions</span>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() =>handleUserAction("view", user)}>
                                        <Eye className="mr-2 size-4" />
                                        View User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() =>handleUserAction("edit", user)}>
                                        <Pencil className="mr-2 size-4" />
                                        Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() =>handleUserAction("deactivate", user)}>
                                        {user.status === "Active" ? (
                                            <DropdownMenuItem onClick={() => handleUserAction("deactivate", user)}>
                                                <UserX className="mr-2 size-4" />
                                                Deactivate
                                            </DropdownMenuItem>
                                            ) : (
                                            <DropdownMenuItem onClick={() => handleUserAction("activate", user)}>
                                                <UserCheck className="mr-2 size-4" />
                                                Activate
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() =>handleUserAction("delete", user)} className="text-destructive focus:text-destructive">
                                        <Trash2 className="mr-2 size-4" />
                                        Delete User
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}

                    {filteredUsers.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No users found.</TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border px-6 py-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-muted-foreground">Showing{" "}{filteredUsers.length === 0 ? 0: startIndex + 1}
                    {" "}to{" "} {Math.min(startIndex + rowsPerPage,filteredUsers.length)}
                    {" "}
                    of {filteredUsers.length} users
                </p>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((page) => page - 1)}
                        className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>

                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() =>setCurrentPage((page) => page + 1)}
                        className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>
            </div>
        </Card>
    );
};

export default UsersTable;