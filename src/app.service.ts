import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrekkingCourse } from './entities/course.entity';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import { join } from 'path';
import { DOMParser } from 'xmldom';
import * as toGeoJSON from '@mapbox/togeojson';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TrekkingCourse)
    private readonly courseRepository: Repository<TrekkingCourse>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async parseGpx(): Promise<any> {
    const gpxFilePath = join(process.cwd(), './src/gpx/VTM23_42km.gpx');
    const gpxData = fs.readFileSync(gpxFilePath, 'utf8');

    const gpxDoc = new DOMParser().parseFromString(gpxData);
    const geojson = toGeoJSON.gpx(gpxDoc);

    const lineStringFeature = geojson.features.find(
      (feature) => feature.geometry.type === 'LineString',
    );

    if (!lineStringFeature) {
      throw new Error('No LineString found in the GPX file.');
    }

    // Check to save in 3D
    const geometry = lineStringFeature.geometry;
    geometry.coordinates = lineStringFeature.geometry.coordinates.map(
      (coord) => {
        return [coord[0], coord[1], coord[2] || 1];
      },
    );
    console.log(geometry);

    await this.courseRepository.save({
      name: 'VTM23 42km',
      route: geometry,
      gpxFilePath: gpxFilePath,
    });
  }
}
