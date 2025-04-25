
import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { FolderOpen, Search, GitBranch, Bug, Package, TestTube } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityBarProps {
  activeSection?: string;
  onSectionChange: (section: string) => void;
}

const activities = [
  { id: 'explorer', icon: FolderOpen, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'source-control', icon: GitBranch, label: 'Source Control' },
  { id: 'run-debug', icon: Bug, label: 'Run and Debug' },
  { id: 'extensions', icon: Package, label: 'Extensions' },
  { id: 'testing', icon: TestTube, label: 'Testing' }
];

const ActivityBar: React.FC<ActivityBarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {activities.map((activity) => (
              <SidebarMenuItem key={activity.id}>
                <SidebarMenuButton
                  tooltip={activity.label}
                  onClick={() => onSectionChange(activity.id)}
                  className={cn(
                    'w-full justify-center',
                    activeSection === activity.id && 'bg-secondary'
                  )}
                >
                  <activity.icon className="h-5 w-5" />
                  <span className="sr-only">{activity.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ActivityBar;
