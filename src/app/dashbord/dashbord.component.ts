import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigService } from '../services/ConfigService';
import { Config } from '../services/config.model';
import { gsap } from 'gsap';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss'],
  providers: [ConfigService],
})
export class DashbordComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  userProfileCollection: any;
  private configService!: ConfigService;
  location = new FormControl('');
  apiKey: string = 'd63a9ea8bd4b1ea85f2a3bac5c92803d';
  loading = false;
  configUrl!: string;
  temperature!: number;
  humidity!: number;
  windSpeed!: number;
  description!: string;
  imgList = [
    'sun.png',
    'cloud.png',
    'wind.png',
    'rain.png',
    'storm.png',
    'snow.png',
  ];
  imgIndex = 1;
  openWeatherContainer = false;
  hideWeatherDetails = true;
  hideUnknownLocationMessage = true;
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  greeting!: string;
  userAmount!: number;
  oldestAge!: number;
  youngestAge!: number;
  userLocation!: string;

  constructor() {
    this.configService = inject(ConfigService);
    this.userProfileCollection = this.getUsersColRef();
  }

  ngOnInit(): void {
    this.getCurrentTime();
    collectionData(this.userProfileCollection).subscribe((data) => {
      this.fillUserOverview(data);
    });
  }

  fillUserOverview(data: any[]) {
    (this.userAmount = data.length),
      (this.oldestAge = this.getOldestUser(data)),
      (this.youngestAge = this.getYoungestUser(data)),
      (this.userLocation = this.getUserLocation(data));
  }

  getWeatherDetails() {
    if (this.location.value == '') {
      this.closeWeatherContainer();
    } else {
      this.loading = true;
      this.loadWeatherDetails();
    }
  }

  loadWeatherDetails() {
    this.configUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.location.value}&units=metric&appid=${this.apiKey}`;
    this.configService.getConfig(this.configUrl).subscribe(
      (data) => {
        this.openWeatherContainer = true;
        this.showWeatherDetails(data);
        this.loading = false;
      },
      (error) => {
        this.showLocationNotFound();
        this.loading = false;
      }
    );
  }

  showWeatherDetails(data: Config) {
    this.changeWeatherContainerStyle('555px', false, true);
    this.assignWeatherDetails(data);
  }

  showLocationNotFound() {
    this.changeWeatherContainerStyle('210px', true, false);
  }

  closeWeatherContainer() {
    this.openWeatherContainer = false;
    this.changeWeatherContainerStyle('100px', true, true);
  }

  changeWeatherContainerStyle(y: string, bool1: boolean, bool2: boolean) {
    gsap.to('.weather-container', {
      height: y,
    });
    this.hideWeatherDetails = bool1;
    this.hideUnknownLocationMessage = bool2;
  }

  assignWeatherDetails(data: Config) {
    this.temperature = Math.floor(data.main.temp);
    this.humidity = data.main.humidity;
    this.windSpeed = data.wind.speed;
    this.description = data.weather[0].description;
    this.assignWeatherImg(data);
  }

  assignWeatherImg(data: Config) {
    let description = data.weather[0].description;
    switch (description) {
      case 'clear sky':
        this.imgIndex = 0;
        break;
      case 'few clouds' || 'scattered clouds' || 'broken clouds':
        this.imgIndex = 1;
        break;
      case 'mist':
        this.imgIndex = 2;
        break;
      case 'rain' || 'shower rain':
        this.imgIndex = 3;
        break;
      case 'thunderstorm':
        this.imgIndex = 4;
        break;
      case 'snow':
        this.imgIndex = 5;
        break;
      default:
        this.imgIndex = 1;
    }
  }

  getCurrentTime() {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    this.renderGreetingText(hours);

    gsap.to('.hand.hours', {
      rotation: hours * 30 + minutes / 2,
    });
    gsap.to('.hand.minutes', {
      rotation: minutes * 6,
    });
  }

  renderGreetingText(hour: number) {
    if (hour >= 6 && hour <= 11) {
      this.greeting = 'Good morning';
    } else if (hour >= 12 && hour <= 18) {
      this.greeting = 'Good afternoon';
    } else if (hour >= 19 && hour <= 23) {
      this.greeting = 'Good evening';
    } else {
      this.greeting = 'Good night';
    }
  }

  getOldestUser(data: any[]) {
    let age = data.reduce((maxAge: any, user: User) => {
      if (user.age !== '' && user.age > maxAge) {
        return user.age;
      } else {
        return maxAge;
      }
    }, 0);
    return age;
  }

  getYoungestUser(data: any[]) {
    let age = data.reduce((minAge: any, user: User) => {
      if (user.age !== '' && user.age < minAge) {
        return user.age;
      } else {
        return minAge;
      }
    }, 130);
    return age;
  }

  getUserLocation(data: any[]) {
    const cities = data.map((user) => user.city);
    const cityCounts = this.createCityCountObjects(cities); // Create an object to count the occurrences of each city
    let mostCommonCity = '';
    let maxCount = 0;
    for (const city in cityCounts) {
      if (cityCounts[city] > maxCount) {
        maxCount = cityCounts[city];
        mostCommonCity = city;
      }
    }
    return mostCommonCity;
  }

  createCityCountObjects(cities: any[]) {
    return cities.reduce((counts, city) => {
      counts[city] = (counts[city] || 0) + 1;
      return counts;
    }, {});
  }

  getUsersColRef() {
    return collection(this.firestore, 'users');
  }
}
