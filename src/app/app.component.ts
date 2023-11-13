import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  backdrop = false;
  sideNav = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: any } }) {
    if (event.target.innerWidth <= 1200) {
      this.sideNavModeSettings(true, false, 'over');
    } else {
      this.sideNavModeSettings(false, true, 'side');
    }
  }

  /**
   * Sets the values of `backdrop` and `sideNav` variables and updates the `mode` attribute of a DOM element with the class `sidenav`
   * @param {boolean} bool1 - A boolean value indicating whether the backdrop should be displayed or not
   * @param {boolean} bool2 - A boolean value that determines whether the side navigation should be displayed or hidden. If `bool2` is `true`,
   * the side navigation will be displayed. Otherwise the side navigation will be hidden
   * @param {string} mode - The mode parameter is a string that represents the mode of the side navigation
   */
  sideNavModeSettings(bool1: boolean, bool2: boolean, mode: string) {
    this.backdrop = bool1;
    this.sideNav = bool2;
    document.querySelector('.sidenav')?.setAttribute('mode', mode);
  }
}
