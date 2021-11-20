import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'registration-system';
  public flagcode = '';

  constructor(public translate: TranslateService) {
    translate.addLangs(['pt-BR', 'en']);
    translate.setDefaultLang('pt-BR');
    translate.onLangChange.subscribe(() => {
      this.flagcode = (translate.currentLang === 'pt-BR')? 'br' : 'us';
    })

    const browserLang = translate.getDefaultLang();
    translate.use(browserLang?.match(/pt-BR|en/) ? browserLang : 'pt-BR');
  }
}
