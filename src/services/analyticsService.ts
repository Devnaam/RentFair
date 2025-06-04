export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  trackEvent(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);
    
    // Store in localStorage for persistence
    try {
      const storedEvents = localStorage.getItem('analytics_events') || '[]';
      const allEvents = [...JSON.parse(storedEvents), analyticsEvent];
      
      // Keep only last 100 events to prevent storage bloat
      const recentEvents = allEvents.slice(-100);
      localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Error storing analytics event:', error);
    }

    console.log('Analytics Event:', analyticsEvent);
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }
}

export const analytics = new AnalyticsService();

// Specific tracking functions
export const trackDashboardClick = (propertyId?: string) => {
  analytics.trackEvent('dashboard_click_from_homepage', {
    property_id: propertyId,
    source: 'landlord_section'
  });
};

export const trackPropertyRotation = (propertyId?: string) => {
  analytics.trackEvent('property_rotation', {
    property_id: propertyId,
    source: 'landlord_section'
  });
};
