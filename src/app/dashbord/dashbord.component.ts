import { Component, OnInit, inject, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigService } from '../services/ConfigService';
import { FirebaseService } from '../services/FirebaseService';
import { Config } from '../services/config.model';
import { gsap } from 'gsap';
import { collectionData } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss'],
  providers: [ConfigService],
})
export class DashbordComponent implements OnInit {
  firebaseService!: FirebaseService;
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
  getScreenHeight!: number;

  constructor() {
    this.configService = inject(ConfigService);
    this.firebaseService = inject(FirebaseService);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerHeight: any } }) {
    this.getScreenHeight = event.target.innerHeight;
  }

  ngOnInit(): void {
    this.getCurrentTime();
    collectionData(this.firebaseService.userProfileCollection).subscribe(
      (data) => {
        this.fillUserOverview(data);
      }
    );
    this.getScreenHeight = window.innerHeight;
  }

  /**
   * Updates several informations about the users, including the total number of users, the oldest and youngest user ages, and the most common user location
   * @param {any[]} data - An array of user data. Each element in the array represents a user and contains information such as age and location
   */
  fillUserOverview(data: any[]) {
    (this.userAmount = data.length),
      (this.oldestAge = this.getOldestUser(data)),
      (this.youngestAge = this.getYoungestUser(data)),
      (this.userLocation = this.getMostUserLocation(data));
  }

  /**
   * The function checks if a location value is empty and either closes the weather container or loads weather details accordingly
   */
  getWeatherDetails() {
    if (this.location.value == '') {
      this.closeWeatherContainer();
    } else {
      this.loading = true;
      this.loadWeatherDetails();
    }
  }

  /**
   * The function "loadWeatherDetails" makes an API call to retrieve weather details for a specific location and displays the results if successful,
   * or shows an error message if the location is not found
   */
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

  /**
   * The function adjusts the weather container style based on the screen height and assigns weather details to the given data
   * @param {Config} data - Config object containing weather details
   */
  showWeatherDetails(data: Config) {
    if (this.getScreenHeight > 1000) {
      this.changeWeatherContainerStyle('555px', false, true);
    } else {
      this.changeWeatherContainerStyle('355px', false, true);
    }
    this.assignWeatherDetails(data);
  }

  /**
   * The function changes the weather container style when the location is not found
   */
  showLocationNotFound() {
    this.changeWeatherContainerStyle('247px', true, false);
  }

  /**
   * The function "closeWeatherContainer" closes the weather container by setting the "openWeatherContainer" variable to false and changing the style of the container
   */
  closeWeatherContainer() {
    this.openWeatherContainer = false;
    this.changeWeatherContainerStyle('100px', true, true);
  }

  /**
   * The function changes the style of the weather container, and updates the values of two boolean variables
   * @param {string} y - The parameter "y" is a string that represents the desired height of the weather container
   * @param {boolean} bool1 - The bool1 parameter is used to determine whether to hide or show the weather details
   * @param {boolean} bool2 - The `bool2` parameter is a boolean value that determines whether to hide or show the unknown location message
   */
  changeWeatherContainerStyle(y: string, bool1: boolean, bool2: boolean) {
    gsap.to('.weather-container', {
      height: y,
    });
    this.hideWeatherDetails = bool1;
    this.hideUnknownLocationMessage = bool2;
  }

  /**
   * The function assigns weather details from the given data object to the corresponding properties and calls another function to assign a weather image
   * @param {Config} data - The `data` parameter is of type `Config`
   */
  assignWeatherDetails(data: Config) {
    this.temperature = Math.floor(data.main.temp);
    this.humidity = data.main.humidity;
    this.windSpeed = data.wind.speed;
    this.description = data.weather[0].description;
    this.assignWeatherImg(data);
  }

  /**
   * The function assigns an image index based on the weather description provided in the data object
   * @param {Config} data - The data parameter is an object of type Config
   */
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

  /**
   * The getCurrentTime function retrieves the current time and updates the rotation of the hour and minute hands on a clock
   */
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

  /**
   * The function `renderGreetingText` sets the value of the `greeting` variable based on the input hour
   * @param {number} hour - The "hour" parameter is a number representing the current hour of the day
   */
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

  /**
   * The function `getOldestUser` takes an array of user data and returns the age of the oldest user
   * @param {any[]} data - an array of objects, where each object represents a user and has a property "age" representing the age of the user
   * @returns the age of the oldest user in the given data array
   */
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

  /**
   * The function `getYoungestUser` takes an array of user data and returns the age of the youngest user
   * @param {any[]} data - an array of objects, where each object represents a user and has a property "age" representing the age of the user
   * @returns The youngest user's age is being returned
   */
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

  /**
   * The function `getMostUserLocation` takes an array of user data and returns the most common city among the users
   * @param {any[]} data - An array of objects representing users. Each user object has a property called "city" which represents the city where the user is located
   * @returns The most common city in the given data array
   */
  getMostUserLocation(data: any[]) {
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

  /**
   * The function creates an object that counts the occurrences of each city in an array
   * @param {any[]} cities - An array of city names
   * @returns an object that contains the count of each city in the input array
   */
  createCityCountObjects(cities: any[]) {
    return cities.reduce((counts, city) => {
      counts[city] = (counts[city] || 0) + 1;
      return counts;
    }, {});
  }
}
