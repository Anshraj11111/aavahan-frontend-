import { apiService } from './api';
import { Event, EventFilters, ApiResponse } from '../types';

export const eventsService = {
  // Get all published events
  async getEvents(filters?: EventFilters): Promise<ApiResponse<Event[]>> {
    const params = new URLSearchParams();
    
    if (filters?.day) params.append('day', filters.day.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());

    const queryString = params.toString();
    const url = queryString ? `/public/events?${queryString}` : '/public/events';
    
    return apiService.get<Event[]>(url);
  },

  // Get featured events
  async getFeaturedEvents(): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>('/public/events/featured');
  },

  // Get event by slug
  async getEventBySlug(slug: string): Promise<ApiResponse<Event>> {
    return apiService.get<Event>(`/public/events/${slug}`);
  },

  // Get event by ID (using slug as backend doesn't have ID endpoint)
  async getEventById(id: string): Promise<Event> {
    const response = await apiService.get<Event>(`/public/events/${id}`);
    return response.data;
  },

  // Get events by day
  async getEventsByDay(day: number): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>(`/public/events?day=${day}`);
  },

  // Get day-wise schedule
  async getDaySchedule(): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>('/public/schedule');
  },

  // Search events
  async searchEvents(query: string): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>(`/public/events/search?q=${encodeURIComponent(query)}`);
  },
};

export default eventsService;