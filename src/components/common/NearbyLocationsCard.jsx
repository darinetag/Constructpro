import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NearbyLocationsCard = ({ title, locations, icon: IconComponent }) => {
  return (
    <Card className="shadow-lg border-l-4 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-primary">
          {IconComponent && <IconComponent className="h-6 w-6 mr-3" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <p className="text-muted-foreground">No nearby locations found or feature not fully implemented.</p>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="p-3 bg-secondary/50 rounded-lg border border-border hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-1">{location.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {location.address}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Phone className="h-4 w-4 mr-2" />
                  {location.phone}
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                    <a href={location.website || "#"} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Location data is for demonstration purposes. Real-time location services require further integration.
        </p>
      </CardContent>
    </Card>
  );
};

export default NearbyLocationsCard;