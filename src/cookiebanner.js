class CookieBanner {
  injectBanner = () => {
    if (document.getElementById("cookiebanner")) return;
    let banner = document.createElement("div");

    banner.innerHTML = `
            <div id="cookiebanner" class="cookiebanner_container cookiebanner_clearfix">
                <div class="cookiebanner_info">
                    We use cookies to make your experience better, check out our <a href="${
                      this.cookiePolicyURL
                    }" target="_blank">cookie policy</a>
                </div>
                <div class="cookiebanner_settings">
                    <label class="cookiebanner_checkbox_container">
                        <input id="cookiebanner_neccessary" type="checkbox" checked disabled/>Neccessary
                        <span class="cookiebanner_checkmark"></span>
                    </label>
                    ${
                      this.supportedPreferences.preferences
                        ? `<label class="cookiebanner_checkbox_container">
                            <input id="cookiebanner_preferences" type="checkbox" ${
                              this.cookiePreferences.preferences === null ||
                              this.cookiePreferences.preferences === true
                                ? "checked"
                                : ""
                            }/>Preferences
                            <span class="cookiebanner_checkmark"></span>
                          </label>`
                        : ``
                    }
                    ${
                      this.supportedPreferences.statistics
                        ? `<label class="cookiebanner_checkbox_container">
                            <input id="cookiebanner_statistics" type="checkbox" ${
                              this.cookiePreferences.statistics === null ||
                              this.cookiePreferences.statistics === true
                                ? "checked"
                                : ""
                            }/>Statistics
                            <span class="cookiebanner_checkmark"></span>
                          </label>`
                        : ``
                    }
                    ${
                      this.supportedPreferences.marketing
                        ? `<label class="cookiebanner_checkbox_container">
                            <input id="cookiebanner_marketing" type="checkbox" ${
                              this.cookiePreferences.marketing === null ||
                              this.cookiePreferences.marketing === true
                                ? "checked"
                                : ""
                            }/>Marketing 
                            <span class="cookiebanner_checkmark"></span>
                          </label>`
                        : ``
                    }
                    <button id="cookiebanner_accept" class="cookiebanner_button cookiebanner_button_accept">Accept</button>
                    <button id="cookiebanner_reject" class="cookiebanner_button cookiebanner_button_reject">Reject</button>

                </div>
            </div>
            `;

    document.body.prepend(banner);
    document
      .getElementById("cookiebanner_accept")
      .addEventListener("click", this.acceptCookies);
    document
      .getElementById("cookiebanner_reject")
      .addEventListener("click", this.rejectCookies);

    //TODO make this less ugly
    setTimeout(() => this.scrollToTop(), 100);
  };

  injectUpdatePreferences = () => {
    if (document.getElementById("cookiebanner_update_preferences")) {
      document
        .getElementById("cookiebanner_update_preferences")
        .addEventListener("click", this.injectBanner);
    } else {
      console.warn(
        "CookieBanner: Please add an cookiebanner_update_preferences element for people to update thier choices."
      );
    }
  };

  injectCSS = () => {
    let css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", "./cookiebanner.css");
    document.head.appendChild(css);
  };

  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  acceptCookies = () => {
    let preferences = this.supportedPreferences.preferences
      ? document.getElementById("cookiebanner_preferences").checked
      : null;
    let statistics = this.supportedPreferences.statistics
      ? document.getElementById("cookiebanner_statistics").checked
      : null;
    let marketing = this.supportedPreferences.marketing
      ? document.getElementById("cookiebanner_marketing").checked
      : null;

    this.cookiePreferences = {
      preferences: preferences,
      statistics: statistics,
      marketing: marketing,
    };

    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify(this.cookiePreferences)
    );

    this.activatePreferences();
    this.hideBanner();
  };

  activatePreferences = () => {
    if (
      (this.cookiePreferences.preferences === false ||
        this.cookiePreferences.statistics === false ||
        this.cookiePreferences.marketing === false) &&
      this.initialCookiePreferences !== this.cookiePreferences
    ) {
      this.deleteCookies();
    }
    if (this.cookiePreferences.preferences) {
      this.activations.preferences();
    }
    if (this.cookiePreferences.statistics) {
      this.activations.statistics();
    }
    if (this.cookiePreferences.marketing) {
      this.activations.marketing();
    }
  };

  rejectCookies = () => {
    this.deleteCookies();
    localStorage.removeItem("cookiePreferences");
    this.hideBanner();
  };

  deleteCookies = () => {
    console.info("CookieBanner: All cookies deleted");
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
        var cookieBase =
          encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
          "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
          d.join(".") +
          " ;path=";
        var p = location.pathname.split("/");
        document.cookie = cookieBase + "/";
        while (p.length > 0) {
          document.cookie = cookieBase + p.join("/");
          p.pop();
        }
        d.shift();
      }
    }
  };

  hideBanner = () => {
    document.getElementById("cookiebanner").remove();
  };

  activate = (config) => {
    this.cookiePolicyURL = config.cookiePolicyURL || "";
    if (this.cookiePolicyURL == "")
      console.warn(
        "CookieBanner: You must include a cookiePolicyURL with details on how your cookies are used."
      );
    this.supportedPreferences = {
      preferences: config.preferences ? true : false,
      statistics: config.statistics ? true : false,
      marketing: config.marketing ? true : false,
    };
    this.activations = {
      preferences: config.preferences || (() => {}),
      statistics: config.statistics || (() => {}),
      marketing: config.marketing || (() => {}),
    };
    this.preferencesNotSet = localStorage.getItem("cookiePreferences") === null;
    this.cookiePreferences = JSON.parse(
      localStorage.getItem("cookiePreferences")
    ) || {
      preferences: null,
      statistics: null,
      marketing: null,
    };
    this.initialCookiePreferences = this.cookiePreferences;
    window.addEventListener("load", () => {
      this.injectCSS();
      this.preferencesNotSet ? this.injectBanner() : this.activatePreferences();
      this.injectUpdatePreferences();
    });
  };
}

let cookieBanner = new CookieBanner();
