# For the app project: things that came up while building the website

Written on 2026-09-27 in the website project. The website session never changes the app, so these
wait for a session in `L:\Bible in Plain Sight\Projects\bible-in-plain-sight`. To start one, tell
Claude there: "Read `L:\Bible in Plain Sight\Projects\bible-in-plain-sight-website\notes\app-todo.md`
and remind me what is on it."

## 1. Ask for a Google Play review at a good moment (Mark's idea)

Mark would like the app to ask for a review at a good moment, for example after a journal entry or
after saving a Stone of Remembrance.

**Suggestion (to discuss with Mark):**
- Ask right after a **Stone of Remembrance is saved**. That is a moment of thanks: the person has
  just written down how God helped. A journal entry can be written on the worst day of someone's
  life, so if it is used at all, only when the mood was "Lighter" or "Light".
- **Never** on crisis or sensitive topics, never on the privacy topics (Being hurt at home, Afraid for
  my safety), never after a check-in answered "About the same" or "Worse", and not in the first days
  of use (for example, only after the second stone). The principle stays: nobody in pain should
  meet a price, and nobody in pain should meet a rating request either.
- At most once every few months. Google limits it anyway.

**Google's rules for the In-App Review API**
(https://developer.android.com/guide/playcore/in-app-review):
- No question before or during the prompt: not "Do you like the app?", not "Would you rate it 5
  stars?".
- No button that starts it (the dialog may not appear because of Google's quota, and the button would
  seem broken). Show Google's card as it is, with nothing on top of it.
- Google decides whether the card appears. The app is not told if a review was written.

**How:** `expo-store-review` (`StoreReview.requestReview()`) uses the Play In-App Review API. It
needs our own build and can only be tested with the app installed from Google Play (for example
the internal testing track).

**The privacy policy must change before that version ships:**
- Section 4 says the app connects "only to Google Play, and only to buy or restore the full
  version". The review card is shown by Google Play too, so that line must name it.
- Section 2 lists the settings the app keeps. If the app remembers when it last asked, add that.
- The website's `pages/privacy-policy.md` is the source; rebuild with `node tools/build.js`.

## 2. Before release (the privacy policy depends on these)

1. **A link to the privacy policy inside the app** (for example in Settings, About):
   https://www.bibleinplainsight.com/privacy-policy. Google Play requires it for every app.
2. **Phone-to-phone transfer:** `allowBackup: false` stops the Google Drive backup, but on some phones
   it does not stop a direct transfer to a new phone. Decide: allow it, or add `dataExtractionRules`
   that exclude everything. If it is blocked, remove that sentence from the privacy policy
   (section 7) and the Support page ("What happens when I change phones?").
3. **Unused storage permission:** expo-file-system declares `WRITE_EXTERNAL_STORAGE` (and
   `READ_EXTERNAL_STORAGE`, already blocked). The app does not use it. Block it too, so the Play
   listing does not show a "files" permission.
4. **The purchase (step 13b):** it ships in version 1 (Mark, 2026-09-27). When it is built, check
   section 9 of the policy and the "Restore purchase" answer on the Support page against what the
   code really does.
5. **Database encryption (SQLCipher):** planned in `src/storage/userDb.ts`. If it ships, the policy
   (section 14) can say the journal is encrypted on the phone. Until then it must not.
6. **Notifications:** keep the local-only imports in `src/notifications/expoNotifications.ts` in the
   release build, so no push token is ever registered.
7. **Final permission list:** read it from the release build (Play Console, App bundle explorer) and
   compare it with section 4 of the policy.
8. **Data safety form** in Play Console: no data collected or shared by the app; payment and reviews
   handled by Google Play. `notes/privacy-facts.md` in the website project has the details.

## 3. For the website, when there is time

Real screenshots from the phone can replace the drawn screens on the home page (light mode, no
notifications in the status bar): Home, Topics, the "Worried about money" card with For someone I
love on and "Anna" typed, What God says, the whole chapter (Matthew 6 from the card), the prayer for
Anna, Write in my journal, How is it now?, Timeline with a stone or two. Never the crisis screen.
