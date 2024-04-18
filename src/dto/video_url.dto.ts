
export class CreateVideoDto {
   time: string; // Change type to string for formatted date
  readonly email: string;
  readonly video_url:string; // Change type to MulterFile
  readonly thumbnail: string; // Change type to MulterFile
  readonly caption: string;

  constructor(time: string, email: string, video_url:string, thumbnail: string, caption: string) {
    // Format the time using date-fns and assign it to the field
    this.time = time; // Example format: "Wed Mar 26 2021"
    this.email = email;
    this.video_url = video_url;
    this.thumbnail = thumbnail;
    this.caption = caption;
  }
  
}

