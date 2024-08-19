import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Point, LineString } from 'geojson';

@Entity({ name: 'courses' })
export class TrekkingCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineStringZ', // Explicitly state 'LineStringZ' to support 3D
    srid: 4326, // Ensure the correct SRID is set
  })
  route: LineString;

  @Column('text')
  gpxFilePath: string; // Optionally store the file path or the raw GPX data
}
