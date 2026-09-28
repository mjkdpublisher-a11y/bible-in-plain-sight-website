# Privacy facts: where each claim in the policy comes from

Checked on 2026-09-27 against the app project (`L:\Bible in Plain Sight\Projects\bible-in-plain-sight`).
Re-check before publishing and whenever the app changes what it stores or sends.

## What the app stores (policy section 2)

| Claim | Source |
|---|---|
| Journal: text, date and time, mood 1 to 5, topic, first name in "For someone I love" | `src/storage/userDb.ts` (table `journal_entries`), `src/storage/journal.ts` |
| Mood labels "Very heavy" to "Light", question "How heavy does it feel right now?" | `src/storage/journal.ts` (`MOOD_QUESTION`, `MOOD_OPTIONS`) |
| Check-ins: topic, due date, answer better / same / worse | `src/storage/userDb.ts` (table `check_ins`), `src/storage/checkIns.ts` |
| Stones: text, date, topic | `src/storage/userDb.ts` (table `stones`), `src/storage/stones.ts` |
| Settings: check-in days, show topic in reminders, country override, welcome seen | `src/storage/preferences.ts` |
| Full version unlocked flag | `src/purchases/fullVersion.ts` (`full_access`) |
| No reading history | No history table in `userDb.ts`; the key-value store is used only in `preferences.ts` and `fullVersion.ts` |
| The name in "For someone I love" is stored only in a journal entry | `src/app/topic/[id].tsx` (comment above `forSomeone`) |

## Privacy topics (section 3)

| Claim | Source |
|---|---|
| Nothing stored, no check-ins or reminders, no journal | `src/content/privacy.ts` (`leavesNoTrace`, `checkInDaysFor`), `journal.ts`, `checkIns.ts`, `stones.ts` |
| No sharing, hidden in recent apps, no screenshots | `src/app/topic/[id].tsx`, `src/ui/usePrivateScreen.ts`, app `CLAUDE.md` (privacy flags) |
| Quick exit | `src/ui/QuickExitButton.tsx` |

## What the app uses on the phone (section 4)

| Claim | Source |
|---|---|
| Region setting for helplines, read on the phone | `src/content/help.ts` (`getLocales()[0].regionCode`) |
| Local reminders, private text by default | `src/notifications/reminders.ts`, `src/storage/preferences.ts` (`showTopicInReminders`) |
| Permissions declared by libraries: `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED` (expo-notifications), `INTERNET`, `READ/WRITE_EXTERNAL_STORAGE` (expo-file-system), screen-capture ones | `node_modules/*/android/src/main/AndroidManifest.xml` |
| Blocked: `READ_EXTERNAL_STORAGE`, `READ_MEDIA_IMAGES`, `DETECT_SCREEN_CAPTURE` | `app.json` (`blockedPermissions`) |
| No network calls; the only planned one is Google Play Billing | app `CLAUDE.md`, no `fetch` or HTTP calls in `src/` |

## Calls, sharing, export, delete (sections 5 to 8)

| Claim | Source |
|---|---|
| Helplines open the dialer / messages with the number filled in, links open the browser | `src/app/crisis.tsx` (`openNumber`, `openWebsite`) |
| Verse image goes through the share menu | `src/app/topic/[id].tsx` (`shareVerse`) |
| Export through the share menu, file cleanup rules | `src/storage/myData.ts` (`exportAllData`, `removeExportFiles`) |
| Delete all data: reminders, tables, VACUUM, export files, settings | `src/storage/myData.ts` (`deleteAllData`) |
| Deleted text overwritten | `src/storage/userDb.ts` (`PRAGMA secure_delete = ON`) |
| Deleting an entry removes its waiting check-in and reminder | `src/storage/journal.ts` (`deleteEntry`) |
| Google Drive backup off | `app.json` (`android.allowBackup: false`) |
| Phone-to-phone transfer may still copy data on some phones | Android 12 behavior changes: `allowBackup="false"` does not stop device-to-device transfer on some devices; that needs `dataExtractionRules` |

## Checked again on 2026-09-28 (the app after the expert review)

| Claim | Source |
|---|---|
| What you write is encrypted (SQLCipher); the key is 32 random bytes made on the phone and kept in Android Keystore | `src/storage/userDb.ts`, `app.json` (`expo-sqlite` with `useSQLCipher`, `expo-secure-store`) |
| Settings (the small key-value store) are not part of the encrypted database, so the policy says "what you write" is encrypted, not "everything" | `src/storage/preferences.ts` (`expo-sqlite/kv-store`) |
| The confirmed country is kept as a country code | `src/storage/preferences.ts` (`country_confirmed`), `src/app/crisis.tsx` |
| Reminders on request on the reviewed crisis topics, and they only say "You have a reminder." | `src/app/write.tsx`, `src/notifications/reminders.ts`, `src/storage/checkIns.ts` (`CheckInTime`) |
| After "Better" on those topics, an optional note about what helped, saved like a stone | `src/app/check-in/[id].tsx` (`addStone`) |
| Private mode carries Quick exit and the hidden screen to the help screen, chapters, related topics and the country list | `src/content/privacy.ts`, `src/app/crisis.tsx`, `src/app/chapter.tsx`, `src/app/country.tsx` |
| The help screen shows the emergency number first | `src/app/crisis.tsx` (`EmergencyLine`) |
| New packages `expo-secure-store`, `expo-crypto`, `expo-dev-client` declare no Android permissions | `node_modules/*/android/src/main/AndroidManifest.xml` |
| About text (expert review G03) | `src/app/settings.tsx` |

## Legal sources (sections 1, 9 to 13, legal notice)

- Google Play User Data policy (what a privacy policy must contain, link required inside the app):
  https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play order management (orders can be searched by order ID or buyer email):
  https://support.google.com/googleplay/android-developer/answer/2741495
- French mandatory website notices for an EI (name, address, "EI", registration, VAT, email,
  phone, host name, address and phone): https://entreprendre.service-public.gouv.fr/vosdroits/F31228
- CNIL on cookies (refusing must be as easy as accepting; continuing to browse is not consent):
  https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ
- Hostinger International Ltd address: https://www.hostinger.com/legal/privacy-policy
- Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, D04 E5W5, +353 1 543 1000.
- The publisher's registration (checked 2026-09-27): https://annuaire-entreprises.data.gouv.fr/entreprise/988101309
  Name "Marek JANY" (person: JANY Marek Krzysztof), entrepreneur individuel, registered in the RNE
  (INPI) on 17/06/2025, commercial, no valid EU VAT number, main activity 55.20Z (short-term
  tourist accommodation). Mark's accountant confirmed that his registered activities also cover
  creating and selling computer and mobile apps.
- Two-step verification is on for the Google account and the Hostinger account and mail
  (Mark, 2026-09-27), so section 14 may say so.

## To do in the app project before release

The list now lives in `notes/app-todo.md` (with the review request and the website screenshots).
