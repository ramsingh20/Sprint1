import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const statusStyles = {
  Active: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  Pending:"bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Inactive:"bg-muted text-muted-foreground",
};

const UserDetailsDialog = ({user,open,onOpenChange,}) => {
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View account information and user details.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-base font-semibold">
              {user.avatar}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{user.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[user.status]}`}>
              {user.status}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <div className="grid grid-cols-2 border-b border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="text-right text-sm font-medium">{user.id}</span>
          </div>

          <div className="grid grid-cols-2 border-b border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-right text-sm font-medium">{user.role}</span>
          </div>

          <div className="grid grid-cols-2 border-b border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">Account Status</span>
            <span className="text-right text-sm font-medium">{user.status}</span>
          </div>

          <div className="grid grid-cols-2 px-4 py-3">
            <span className="text-sm text-muted-foreground">Joined</span>
            <span className="text-right text-sm font-medium">{user.joinedDate}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;