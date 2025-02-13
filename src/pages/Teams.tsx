import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';

const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Team Lead', avatar: 'john' },
  { id: 2, name: 'Jane Smith', role: 'Developer', avatar: 'jane' },
  { id: 3, name: 'Mike Johnson', role: 'Designer', avatar: 'mike' },
  { id: 4, name: 'Sarah Wilson', role: 'Product Manager', avatar: 'sarah' },
];

export function Teams() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black">Teams</h1>
        <Button
          className="border-2 border-black bg-[#4CAF50] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-black">
                  <AvatarImage src={`https://avatar.vercel.sh/${member.avatar}`} />
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}