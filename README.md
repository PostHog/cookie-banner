# Cookie Banner - BETA
Cookie banner which you can use with PostHog and other tools, the banner will activate services in specific cookie types (aligned with GDPR), when a user accepts them. If a user hits the reject key, cookies will be purged.

# How to configure
It's simple, in your document head, include cookiebanner.js and then activate it as below, only include functions for the types of cookies you track.

```html
<script src="https://cdn.jsdelivr.net/gh/PostHog/cookie-banner@main/public/cookiebanner.min.js"></script>
```

It's essential that you include a link to a cookie policy which explains clearly what your cookies do.

```javascript
cookieBanner.activate({
        preferences: () => {
            //Insert your preferences tracking code here
        },
        statistics: () => {
            //Insert your statistics tracking code here
            // e.g. posthog init
        },  
        marketing: () => {
            //Insert your marketing tracking code here
            // e.g. Facebook Pixel
        },
        cookiePolicyURL: "" //your cookie policy URL
});
````

It's also essential that you give users the option to opt out, do to this just add an element with `id="cookiebanner_update_preferences"` and when someone clicks on it it will launch the cookie banner again.

```html
<a href="#" id="cookiebanner_update_preferences">
    Update cookie preferences
</a>
```
Now you're ready to go

## How does it look?
We've gone for simplicty here:


## Caveats
* When someone changes their cookie preferences to remove only one type of cookies, all cookies will be purged (since we don't now which cookie belongs to which category)
* When all cookies are removed, some essential cookies make also be removed
* HTTPOnly cookies cannot be removed when clicking reject
* It's not been tested well on mobile so some layout issues may exist
