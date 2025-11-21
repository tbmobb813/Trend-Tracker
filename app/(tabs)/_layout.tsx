import { Tabs } from 'expo-router';
import Colors from '@/constants/colors';
import { 
  Home, 
  Search, 
  PlusSquare,
  Bookmark, 
  User,
  BarChart,
  Calendar
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: (props: { color?: string; size?: number }) => <Home size={props.size} color={props.color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: (props: { color?: string; size?: number }) => <Search size={props.size} color={props.color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: (props: { color?: string; size?: number }) => <BarChart size={props.size} color={props.color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: (props: { color?: string; size?: number }) => <Calendar size={props.size} color={props.color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: (props: { color?: string; size?: number }) => <PlusSquare size={props.size} color={props.color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: (props: { color?: string; size?: number }) => <Bookmark size={props.size} color={props.color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: (props: { color?: string; size?: number }) => <User size={props.size} color={props.color} />,
        }}
      />
    </Tabs>
  );
}
