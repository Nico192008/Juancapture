export interface Album {
  id: string;
  name: string;
  date: string;
  cover_image: string;
  description: string;
  created_at: string;
}

export interface Image {
  id: string;
  album_id: string;
  image_url: string;
  thumbnail_url: string;
  caption: string;
  order_index: number;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  description: string;
  duration: number;
  created_at: string;
}

export interface Booking {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  event_type: string;
  event_date: string;
  message: string;
  status?: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  message: string;
  rating: number;
  event_type: string;
  is_featured: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
