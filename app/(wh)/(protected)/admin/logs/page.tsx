'use client';

import React, { useState, useEffect } from 'react';
import { activityApi, Activity, ActivityQueryParams } from '@/lib/activity-api';
import { Card } from '@/components/ui/card';
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

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  LOGIN: 'bg-purple-100 text-purple-800',
  LOGOUT: 'bg-gray-100 text-gray-800',
  PASSWORD_CHANGE: 'bg-yellow-100 text-yellow-800',
  VIEW: 'bg-indigo-100 text-indigo-800',
  EXPORT: 'bg-pink-100 text-pink-800',
};

const roleColors: Record<string, string> = {
  SUPERADMIN: 'bg-red-100 text-red-800',
  ADMIN: 'bg-orange-100 text-orange-800',
  TEACHER: 'bg-blue-100 text-blue-800',
  STUDENT: 'bg-green-100 text-green-800',
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-2">Monitor and track all system activities</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Search
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Action
            </label>
            <Select onValueChange={(value) => handleFilterChange('action', value)}>
              <SelectTrigger>
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              User Role
            </label>
            <Select onValueChange={(value) => handleFilterChange('userRole', value)}>
              <SelectTrigger>
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Entity Type
            </label>
            <Select onValueChange={(value) => handleFilterChange('entityType', value)}>
              <SelectTrigger>
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

        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({ page: 1, limit: 20, order: 'desc' });
              setSearchTerm('');
            }}
          >
            Clear Filters
          </Button>
          <div className="text-sm text-gray-600">
            Showing {activities.length} of {meta.total} activities
          </div>
        </div>
      </Card>

      {/* Activity Table */}
      <Card>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading activity logs...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            <p className="font-medium">Error loading activity logs</p>
            <p className="text-sm mt-2">{error}</p>
            <Button className="mt-4" onClick={fetchActivities}>
              Retry
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No activity logs found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Entity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(activity.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{activity.username || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{activity.userId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[activity.userRole]}>
                        {activity.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={actionColors[activity.action]}>
                        {activity.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm">{activity.description}</div>
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <details className="text-xs text-gray-500 mt-1">
                          <summary className="cursor-pointer hover:text-gray-700">
                            View details
                          </summary>
                          <pre className="mt-1 p-2 bg-gray-50 rounded overflow-auto">
                            {JSON.stringify(activity.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{activity.entityType}</div>
                      {activity.entityId && (
                        <div className="text-xs text-gray-500">{activity.entityId}</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {meta.page} of {meta.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page === 1}
                  onClick={() => handlePageChange(meta.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page === meta.totalPages}
                  onClick={() => handlePageChange(meta.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ActivityLogPage;