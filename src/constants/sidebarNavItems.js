import {
  Search,
  Inbox,
  CalendarDays,
  Calendar,
  Tags,
  CheckCircle2
} from 'lucide-react';

export const sidebarNavItems = [
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    path: '/search',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    path: '/inbox',
  },
  {
    id: 'today',
    label: 'Today',
    icon: CalendarDays,
    path: '/',      
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    icon: Calendar,
    path: '/upcoming',
  },
  {
    id: 'filters',
    label: 'Filters & Labels',
    icon: Tags,
    path: '/filters',
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    path: '/completed',
  },
];