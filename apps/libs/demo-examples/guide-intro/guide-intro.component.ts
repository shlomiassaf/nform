import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';
import { UIDeveloper } from './model';
import { FORM_CONTROL_COMPONENT } from '@pebula/nform';
import { PblRowLayoutNformRenderer, TourService, PblExampleFormViewComponent } from '@pebula/apps/shared-nform';

@Component({
  selector: 'pbl-guide-intro-example',
  templateUrl: './guide-intro.component.html',
  styleUrls: ['./guide-intro.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer }
  ]
})
@Example('pbl-guide-intro-example', { title: 'Guide Intro', additionalFiles: ['./model.ts'] })
export class GuideIntroExample {

  model = new UIDeveloper();

  constructor(private tour: TourService, private exampleView: PblExampleFormViewComponent) {  }


  ngOnInit(): void {
    if (localStorage.getItem('pbl-guide-intro-example') === 'true') {
      // return;
    }

    this.tour.ready
      .subscribe( Shepherd => {
        const tour = new Shepherd.Tour({
          useModalOverlay: true,
          defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
            scrollTo: false,
          }
        });

        const nextButton = { text: 'Next', action: tour.next };
        const backButton = { text: 'Back', action: tour.back };

        tour.addStep({
          text: 'This is the dashboard, it includes a live form example.',
          attachTo: {
            element: 'pbl-example-form-view',
            on: 'top'
          },
          buttons: [ nextButton ]
        });

        tour.addStep({
          text: 'Each example has a title.',
          attachTo: {
            element: 'pbl-example-form-view .pbl-example-title',
            on: 'top'
          },
          buttons: [ backButton, nextButton ]
        });

        tour.addStep({
          text: () => 'A LED indicating the state of the form<br>' + document.querySelector('pbl-led-legend-chunk').outerHTML,
          attachTo: {
            element: 'pbl-example-form-view .status-indicator',
            on: 'bottom'
          },
          buttons: [ backButton, nextButton ]
        });

        tour.addStep({
          text: 'A button to show/hide the source code',
          attachTo: {
            element: 'pbl-example-form-view .pbl-example-code-button',
            on: 'top'
          },
          buttons: [ backButton, nextButton ],
          when: {
            show: () => this.exampleView.showSourceCode = true,
            hide: () => this.exampleView.showSourceCode = false,
          }
        });

        tour.addStep({
          text: 'A button to toggle the interactive panel',
          attachTo: {
            element: 'pbl-example-form-view .pbl-example-code-button + button',
            on: 'top'
          },
          buttons: [ backButton, nextButton ],
          when: {
            show: () => this.exampleView.toggleJsonView(),
          }
        });

        tour.addStep({
          text: 'The <b>Model</b> tab shows the current state of the model instance.',
          attachTo: {
            element: 'pbl-example-form-view .mat-tab-label:first-of-type',
            on: 'top'
          },
          buttons: [ backButton, nextButton ],
        });

        tour.addStep({
          text: 'The <b>Form</b> tab shows the current state of the form instance.',
          attachTo: {
            element: 'pbl-example-form-view .mat-tab-label:last-of-type',
            on: 'top'
          },
          buttons: [ backButton, nextButton ],
        });

        tour.addStep({
          text: 'Lets fill the form with some data',
          attachTo: {
            element: 'pbl-example-form-view pbl-nform',
            on: 'top'
          },
          buttons: [ backButton, nextButton ],
          when: {
            show: () => {
              this.exampleView.nFormCmp.form.setValue({
                yearOfBirth: 2000,
                gender: 'other',
                framework: 'angular',
              });
            },
          }
        });

        tour.addStep({
          text: 'Data is still not visible in the Model tab, lets commit so to update it',
          attachTo: {
            element: 'pbl-example-form-view .json-view',
            on: 'left'
          },
          buttons: [ backButton, nextButton ],
          when: {
            show: () => {
              this.exampleView.onCommitToModel();
            },
          }
        });

        tour.start();
        localStorage.setItem('pbl-guide-intro-example', 'true');
      });
  }

}
