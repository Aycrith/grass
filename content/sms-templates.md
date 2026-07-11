# SMS Templates — Review-Request, On-The-Way, Weather-Cancel

> **Tool:** Google Voice (free) until volume justifies Twilio ($0.0079/SMS).
> **Length:** Every SMS ≤160 chars. Phone carriers split longer.
> **Voice:** Plain, friendly, no exclamation marks except in genuine excitement.
> **Sign-off:** Always sign with first name only. Customers text back fast if they recognize you.

---

## S1 — Review Request (sent 2 hours after job completion)

```
Hey [first name] — finished your mow. If you have a sec, a quick
Google review helps a lot: [short review link]. Thanks! — [your name]
```

**Char count:** ~140

### Variants

- For hedge-trim: *"Hey [first name] — finished the trim. Quick Google review helps a ton: [link]. Thanks! — [name]"*
- For mulching: *"Hey [first name] — mulch is down. Quick Google review if you have 30 sec: [link]. — [name]"*

---

## S2 — On-The-Way (sent 15-30 min before arrival)

```
Hey [first name] — heading your way. ETA [15 min / 30 min].
Anything I should know before I get there? — [your name]
```

**Char count:** ~110

### Why this works

- Sets expectations (no surprise yard trucks).
- Gives them a chance to move cars, secure dogs, unlock gates.
- Builds the "actual person, not a corporate service" feel.

---

## S3 — Weather Cancel (sent 6:30 AM day-of if rain forces push)

```
Hey [first name] — rain today, pushing your mow to [Wed]. No charge.
Text you tomorrow to confirm. — [your name]
```

**Char count:** ~110

---

## S4 — Hurricane Mode Activation (sent 48 hours pre-storm)

```
Hey [first name] — [Storm name] heading our way. Switching to prep
mode. Want pre-storm prep? Reply YES and I'll fit you in tomorrow AM.
Stay safe. — [your name]
```

**Char count:** ~150

---

## S5 — Hurricane Mode Update (sent 24 hours pre-storm)

```
Hey [first name] — [Storm name] update: prep window closing
[tomorrow 6 PM]. If you want debris cleanup after, just reply
CLEANUP and I'll be on your list. — [your name]
```

**Char count:** ~155

---

## S6 — Post-Storm Check-In (sent 24 hours after storm passes)

```
Hey [first name] — storm passed. How's the yard? If you need debris
haul-off, reply CLEANUP and I'll get you scheduled this week.
No charge for the check-in. — [your name]
```

**Char count:** ~155

---

## S7 — Quote Ready (sent when quote email lands)

```
Hey [first name] — sent your quote by email. Take a look when you
get a sec. Questions? Just reply here. — [your name]
```

**Char count:** ~115

---

## S8 — Schedule Confirmation (sent when customer accepts quote)

```
Hey [first name] — you're on the schedule. First visit [Tuesday]
[8-10 AM]. I'll text you the day before to confirm. — [your name]
```

**Char count:** ~125

---

## S9 — One-Touch Follow-Up (sent if customer doesn't respond to quote in 7 days)

```
Hey [first name] — checking back on the quote from last week. Still
interested? Happy to adjust if anything's off. — [your name]
```

**Char count:** ~135

---

## S10 — Service Reminder (sent 24 hours before scheduled visit)

```
Hey [first name] — your [mow / trim / mulch] is on for tomorrow
[8-10 AM]. Anything I should know? — [your name]
```

**Char count:** ~115

---

## SMS anti-patterns

- ❌ Texts over 160 chars (carrier splits + looks sloppy).
- ❌ Multiple questions in one SMS (pick one).
- ❌ Marketing copy ("Hi! We're having a summer special...") — illegal without opt-in.
- ❌ Sending before 7 AM or after 9 PM (annoying).
- ❌ Abbreviations customers won't get ("BRB", "tbh", etc.).
- ❌ No sign-off (feels automated).