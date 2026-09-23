import { test as base, expect } from '@playwright/test';
import { SamplePage } from '@pages/SamplePage';
import { SampleModule } from '@modules/SampleModule';
import { RegisterLoginPage } from '@pages/RegisterLoginPage';
import { RegisterLoginModule } from '@modules/RegisterLoginModule';
import { RegistrationModule } from '@modules/RegistrationModule';
import { AdminLoginSettingsModule } from '@modules/AdminLoginSettingsModule';
import { ProfileCompletionPage } from '@pages/ProfileCompletionPage';
import { ProfileCompletionModule } from '@modules/ProfileCompletionModule';
import { ProfileEditPage } from '@pages/ProfileEditPage';
import { ProfileEditModule } from '@modules/ProfileEditModule';
import { GlobalSearchModule } from '@modules/GlobalSearchModule';
import { EventListingModule } from '@modules/EventListingModule';
import { EventDetailsModule } from '@modules/EventDetailsModule';
import { ExperienceModule } from '@modules/ExperienceModule';
import { HomeScreenModule } from '@modules/HomeScreenModule';
import { CinemasListingDetailModule } from '@modules/CinemasListingDetailModule';
import { MovieDetailsModule } from '@modules/MovieDetailsModule';
import { OffersModule } from '@modules/OffersModule';
import { CitySelectionModule } from '@modules/CitySelectionModule';
import { LocationModule } from '@modules/LocationModule';
import { CuratedShowsModule } from '@modules/CuratedShowsModule';
import { ComingSoonModule } from '@modules/ComingSoonModule';
import { MovieAlertsModule } from '@modules/MovieAlertsModule';
import { DownloadCalendarModule } from '@modules/DownloadCalendarModule';
import { AboutUsModule } from '@modules/AboutUsModule';
import { LegalContentModule } from '@modules/LegalContentModule';
import { FaqsModule } from '@modules/FaqsModule';
import { NewsModule } from '@modules/NewsModule';
import { InvestorSectionModule } from '@modules/InvestorSectionModule';
import { CareersModule } from '@modules/CareersModule';
import { CorporateBookingModule } from '@modules/CorporateBookingModule';
import { BulkGiftCardModule } from '@modules/BulkGiftCardModule';
import { AvatarModule } from '@modules/AvatarModule';

interface Fixtures {
  samplePage: SamplePage;
  sampleModule: SampleModule;
  registerLoginPage: RegisterLoginPage;
  registerLoginModule: RegisterLoginModule;
  registrationModule: RegistrationModule;
  adminLoginSettingsModule: AdminLoginSettingsModule;
  profileCompletionPage: ProfileCompletionPage;
  profileCompletionModule: ProfileCompletionModule;
  profileEditPage: ProfileEditPage;
  profileEditModule: ProfileEditModule;
  globalSearchModule: GlobalSearchModule;
  eventListingModule: EventListingModule;
  eventDetailsModule: EventDetailsModule;
  experienceModule: ExperienceModule;
  homeScreenModule: HomeScreenModule;
  cinemasListingDetailModule: CinemasListingDetailModule;
  movieDetailsModule: MovieDetailsModule;
  offersModule: OffersModule;
  citySelectionModule: CitySelectionModule;
  locationModule: LocationModule;
  curatedShowsModule: CuratedShowsModule;
  comingSoonModule: ComingSoonModule;
  movieAlertsModule: MovieAlertsModule;
  downloadCalendarModule: DownloadCalendarModule;
  aboutUsModule: AboutUsModule;
  legalContentModule: LegalContentModule;
  faqsModule: FaqsModule;
  newsModule: NewsModule;
  investorSectionModule: InvestorSectionModule;
  careersModule: CareersModule;
  corporateBookingModule: CorporateBookingModule;
  bulkGiftCardModule: BulkGiftCardModule;
  avatarModule: AvatarModule;
}

export const test = base.extend<Fixtures>({
  samplePage: async ({ page }, use) => {
    await use(new SamplePage(page));
  },

  sampleModule: async ({ page }, use) => {
    await use(new SampleModule(page));
  },

  registerLoginPage: async ({ page }, use) => {
    await use(new RegisterLoginPage(page));
  },

  registerLoginModule: async ({ page }, use) => {
    await use(new RegisterLoginModule(page));
  },

  registrationModule: async ({ page }, use) => {
    await use(new RegistrationModule(page));
  },

  adminLoginSettingsModule: async ({ page }, use) => {
    await use(new AdminLoginSettingsModule(page));
  },

  profileCompletionPage: async ({ page }, use) => {
    await use(new ProfileCompletionPage(page));
  },

  profileCompletionModule: async ({ page }, use) => {
    await use(new ProfileCompletionModule(page));
  },

  profileEditPage: async ({ page }, use) => {
    await use(new ProfileEditPage(page));
  },

  profileEditModule: async ({ page }, use) => {
    await use(new ProfileEditModule(page));
  },

  globalSearchModule: async ({ page }, use) => {
    await use(new GlobalSearchModule(page));
  },

  eventListingModule: async ({ page }, use) => {
    await use(new EventListingModule(page));
  },

  eventDetailsModule: async ({ page }, use) => {
    await use(new EventDetailsModule(page));
  },

  experienceModule: async ({ page }, use) => {
    await use(new ExperienceModule(page));
  },

  homeScreenModule: async ({ page }, use) => {
    await use(new HomeScreenModule(page));
  },

  cinemasListingDetailModule: async ({ page }, use) => {
    await use(new CinemasListingDetailModule(page));
  },

  movieDetailsModule: async ({ page }, use) => {
    await use(new MovieDetailsModule(page));
  },

  offersModule: async ({ page }, use) => {
    await use(new OffersModule(page));
  },

  citySelectionModule: async ({ page }, use) => {
    await use(new CitySelectionModule(page));
  },

  locationModule: async ({ page }, use) => {
    await use(new LocationModule(page));
  },

  curatedShowsModule: async ({ page }, use) => {
    await use(new CuratedShowsModule(page));
  },

  comingSoonModule: async ({ page }, use) => {
    await use(new ComingSoonModule(page));
  },

  movieAlertsModule: async ({ page }, use) => {
    await use(new MovieAlertsModule(page));
  },

  downloadCalendarModule: async ({ page }, use) => {
    await use(new DownloadCalendarModule(page));
  },

  aboutUsModule: async ({ page }, use) => {
    await use(new AboutUsModule(page));
  },

  legalContentModule: async ({ page }, use) => {
    await use(new LegalContentModule(page));
  },

  faqsModule: async ({ page }, use) => {
    await use(new FaqsModule(page));
  },

  newsModule: async ({ page }, use) => {
    await use(new NewsModule(page));
  },

  investorSectionModule: async ({ page }, use) => {
    await use(new InvestorSectionModule(page));
  },

  careersModule: async ({ page }, use) => {
    await use(new CareersModule(page));
  },

  corporateBookingModule: async ({ page }, use) => {
    await use(new CorporateBookingModule(page));
  },

  bulkGiftCardModule: async ({ page }, use) => {
    await use(new BulkGiftCardModule(page));
  },

  avatarModule: async ({ page }, use) => {
    await use(new AvatarModule(page));
  },
});

export { expect };
