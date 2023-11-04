export interface Config {
  weather: [
    {
      main: string;
      description: string;
    }
  ];
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  cod: number;
  // name: string;
}
