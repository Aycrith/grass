# Runbook 2 — Weather Cancellation Policy

> **Use:** When weather makes mowing unsafe or low-quality. Read once before the rainy season (June-September in Largo).
> **Goal:** Make the call early, communicate cleanly, reschedule without friction.
> **Rule:** Customer never gets a "we tried to mow in the rain and made it worse" experience. Cancel or reschedule, don't push through.

---

## When to cancel (decision tree)

```
At T-12h (night before):
  Forecast rain > 60% probability for the morning?
    YES → text all impacted customers (template S3). Go back to bed.
    NO  → proceed.

At T-2h (morning of):
  Live radar showing rain within the next 90 minutes?
    YES → text all impacted customers NOW (template S3).
    NO  → proceed.

At T-0 (at the property):
  Light rain already falling but not heavy?
    - If customer is home: ask. "Want me to push through or reschedule?"
    - If customer not home: defer to your judgment. Light rain on dry soil is OK.
    - Heavy rain, standing water, lightning: cancel. Don't even start.
```

## The thresholds (decide once, then default to them)

| Condition | Decision |
|---|---|
| Forecast > 60% rain | Cancel night before (T-12h) |
| Lightning within 10 mi | Cancel immediately (T-0) |
| Sustained winds > 25 mph | Cancel (debris risk, mower control) |
| Sustained winds > 30 mph | Hurricane mode activates (see Runbook 4) |
| Standing water > 1" deep on turf | Skip this visit, double-cut next visit |
| Light drizzle + dry soil + no lightning | Mow if customer confirms |
| Heavy rain | Don't start |

## How to communicate (use template S3)

```
Hey [first name] — it's [your first name] from Largo Lawn.
Looks like [storm description] is heading our way. Want
to push your mow to [alternative day] instead of getting
a poor cut today? Free reschedule, no charge. Just reply
with the day that works.
   [Your first name]
   (727) 555-0123
```

### Email version (template T6) — sent at the same time

```
Subject: Reschedule — [service day]
To: [customer email]

[First name],

Heads up — [storm name / forecast description] is going to
hit [33771 / your area] tomorrow morning. Rather than push
through and give you a half-cut lawn, I'd rather reschedule.

Days I have open this week:
  - [Day, date]
  - [Day, date]

Just reply with which one works. No charge for the swap.

If none of these work, no problem — we'll roll this week's
visit into next week and you'll get a double-cut.

— [Your first name]
Largo Lawn
```

## What NEVER happens

- **We never charge a cancellation fee for weather.** It's weather.
- **We never say "we'll be there rain or shine."** We're not landscapers in 1960.
- **We never let the customer talk us into a bad cut.** If the conditions are wrong, they're wrong.
- **We never skip the reschedule.** Cancel without reschedule = lost revenue. Cancel + reschedule = great service.

## Recurring customers — special handling

For weekly clients on auto-schedule:

1. **Cancel this week.**
2. **Reschedule to the same day next week** (default). No need to ask.
3. **Text message**: *"Weather's pushing us — moving your cut to [next same day]. Let me know if that doesn't work."* (template S3 variant)
4. **Skip "double-cut"** unless the grass is significantly overgrown. One week of weather usually doesn't justify a longer cut; two weeks sometimes does.

For bi-weekly clients:

1. **Cancel this week.**
2. **Push to the next bi-weekly slot.** Customer is already accustomed to 14-day cycles.
3. **If a 14-day cycle lands in a wet week, you're at the customer's mercy.** Communicate early. Re-quote if the cut is going to be 50% longer.

For one-off customers:

1. **Cancel and propose a new date.**
2. **Customer picks the day.** Don't impose your availability.

## What about "rain checks" — i.e., a partial visit?

**Don't.** A half-mowed lawn is worse than no mow. If you're going to do the work, do all of it. If you're going to skip, skip clean. The brand commitment to "wow" cuts requires the full treatment every time.

## Edge case: rain that's forecast but doesn't arrive

Cancel anyway. The cost of one extra cancellation: $0 (no charge). The cost of showing up anyway: 1-2 hours of driving for nothing. The math is clear.

## Edge case: rain that arrives but wasn't forecast

Same-day decision. Text customers with afternoon appointments: "Rain came in — pushing your cut to [day]." Apologize for the late notice but don't apologize for the call — better a clean cancel than a sloppy cut.

## Documentation

- **Spreadsheet column**: "Weather Cancel Y/N" per visit. Track rate over time.
- **Quarterly review**: If your weather cancel rate is over 25%, you're scheduling too tightly. Build a 1-day buffer into the weekly route.
- **Customer notifications**: Always notify. Don't leave them wondering why you didn't show.

## Tone

Customers expect lawn services to handle weather like adults. "I checked the radar, this isn't going to work, here's a new day" is what they want to hear. Not "I'm so sorry for the inconvenience" — that's a restaurant. Not "we'll be there rain or shine" — that's a lie.