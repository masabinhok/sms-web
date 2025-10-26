'use client';

import React, { useState, useEffect } from 'react';
import { activityApi, Activity, ActivityQueryParams } from '@/lib/activity-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Activity as ActivityIcon,
  Search,
  Filter,
  Download,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
  Shield,
  Eye,
  Trash2,
  Edit,
  LogIn,
  LogOut,
  Key,
  FileUp,
  BarChart3,
} from 'lucide-react';

const actionColors: Record<string, string> = {
  CREATE: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  UPDATE: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
  DELETE: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
  LOGIN: 'bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200',
  LOGOUT: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200',
  PASSWORD_CHANGE: 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',
  VIEW: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200',
  EXPORT: 'bg-pink-100 text-pink-800 hover:bg-pink-100 border-pink-200',
};

const roleColors: Record<string, string> = {
  SUPERADMIN: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700',
  ADMIN: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700',
  TEACHER: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700',
  STUDENT: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700',
};

const actionIcons: Record<string, any> = {
  CREATE: FileText,
  UPDATE: Edit,
  DELETE: Trash2,
  LOGIN: LogIn,
  LOGOUT: LogOut,
  PASSWORD_CHANGE: Key,
  VIEW: Eye,
  EXPORT: FileUp,
};

const ActivityLogPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ActivityQueryParams>({
    page: 1,
    limit: 20,
    order: 'desc',
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityApi.getAll(filters);
      setActivities(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity logs');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  const getActivityStats = () => {
    const totalActivities = meta.total;
    const recentActivities = activities.filter(a => {
      const date = new Date(a.createdAt);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      return diffInHours < 24;
    }).length;
    
    const actionCounts = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonAction = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalActivities,
      recentActivities,
      mostCommonAction: mostCommonAction ? mostCommonAction[0] : 'N/A',
    };
  };

  const stats = getActivityStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <ActivityIcon className="w-10 h-10 text-blue-600" />
              Activity Logs
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Monitor and track all system activities in real-time
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchActivities}
              className="premium-button border-blue-200 hover:border-blue-400 hover:bg-blue-50"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white premium-button">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="premium-card border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Activities</CardTitle>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalActivities}</div>
              <p className="text-xs text-gray-600 mt-1">All tracked events</p>
            </CardContent>
          </Card>

          <Card className="premium-card border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Last 24 Hours</CardTitle>
              <Clock className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.recentActivities}</div>
              <p className="text-xs text-gray-600 mt-1">Recent activities</p>
            </CardContent>
          </Card>

          <Card className="premium-card border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Most Common</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.mostCommonAction}</div>
              <p className="text-xs text-gray-600 mt-1">Action type</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="premium-card border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <CardTitle>Filter & Search</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({ page: 1, limit: 20, order: 'desc' });
                    setSearchTerm('');
                  }}
                  className="text-gray-600 hover:text-red-600 hover:border-red-300"
                >
                  <RefreshCcw className="w-3 h-3 mr-2" />
                  Clear Filters
                </Button>
              </div>
              <CardDescription>
                Showing {activities.length} of {meta.total} activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="premium-input"
                    />
                    <Button 
                      onClick={handleSearch}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ActivityIcon className="w-4 h-4" />
                    Action Type
                  </label>
                  <Select onValueChange={(value) => handleFilterChange('action', value)}>
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="CREATE">Create</SelectItem>
                      <SelectItem value="UPDATE">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                      <SelectItem value="LOGIN">Login</SelectItem>
                      <SelectItem value="LOGOUT">Logout</SelectItem>
                      <SelectItem value="PASSWORD_CHANGE">Password Change</SelectItem>
                      <SelectItem value="VIEW">View</SelectItem>
                      <SelectItem value="EXPORT">Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User Role
                  </label>
                  <Select onValueChange={(value) => handleFilterChange('userRole', value)}>
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="STUDENT">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Entity Type
                  </label>
                  <Select onValueChange={(value) => handleFilterChange('entityType', value)}>
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="All Entities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="CLASS">Class</SelectItem>
                      <SelectItem value="SUBJECT">Subject</SelectItem>
                      <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                      <SelectItem value="GRADE">Grade</SelectItem>
                      <SelectItem value="ATTENDANCE">Attendance</SelectItem>
                      <SelectItem value="SCHOOL_SETTINGS">School Settings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="premium-card border-2 border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <RefreshCcw className="w-8 h-8 animate-spin text-blue-600" />
                </div>
                <p className="text-lg font-medium text-gray-900">Loading activity logs...</p>
                <p className="text-sm text-gray-600 mt-2">Please wait while we fetch the data</p>
              </div>
            ) : error ? (
              <div className="p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-lg font-semibold text-red-600">Error loading activity logs</p>
                <p className="text-sm text-gray-600 mt-2">{error}</p>
                <Button 
                  className="mt-6 bg-blue-600 hover:bg-blue-700"
                  onClick={fetchActivities}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <ActivityIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900">No activity logs found</p>
                <p className="text-sm text-gray-600 mt-2">Try adjusting your filters or create some activities</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-gray-100 hover:to-blue-100/50">
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Timestamp
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Role
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <ActivityIcon className="w-4 h-4" />
                            Action
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Description
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Entity
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity, index) => {
                        const ActionIcon = actionIcons[activity.action] || ActivityIcon;
                        return (
                          <motion.tr
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group hover:bg-blue-50/50 transition-colors border-b border-gray-100"
                          >
                            <TableCell className="text-sm">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {formatRelativeTime(activity.createdAt)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(activity.createdAt)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                                  {activity.username ? activity.username.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {activity.username || 'Unknown User'}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    {activity.userId.substring(0, 8)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${roleColors[activity.userRole]} shadow-sm`}>
                                {activity.userRole}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${actionColors[activity.action]} border flex items-center gap-1.5 w-fit`}>
                                <ActionIcon className="w-3 h-3" />
                                {activity.action}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-md">
                              <div className="text-sm text-gray-900 font-medium">
                                {activity.description}
                              </div>
                              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                <details className="text-xs text-gray-600 mt-2 group-hover:text-gray-900 transition-colors">
                                  <summary className="cursor-pointer hover:text-blue-600 font-medium flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    View metadata
                                  </summary>
                                  <pre className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg overflow-auto text-xs font-mono shadow-inner">
                                    {JSON.stringify(activity.metadata, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded w-fit">
                                  {activity.entityType}
                                </span>
                                {activity.entityId && (
                                  <span className="text-xs text-gray-500 font-mono mt-1">
                                    ID: {activity.entityId.substring(0, 12)}...
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Enhanced Pagination */}
                <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-blue-50/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-700 font-medium">
                        Page <span className="font-bold text-blue-600">{meta.page}</span> of{' '}
                        <span className="font-bold text-blue-600">{meta.totalPages}</span>
                      </div>
                      <div className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                        {((meta.page - 1) * meta.limit) + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} activities
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={meta.page === 1}
                        onClick={() => handlePageChange(meta.page - 1)}
                        className="premium-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-400"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={meta.page === meta.totalPages}
                        onClick={() => handlePageChange(meta.page + 1)}
                        className="premium-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-400"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityLogPage;