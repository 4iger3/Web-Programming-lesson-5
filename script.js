(function loadJQuery() {
  if (window.jQuery) {
    initializeEffects(window.jQuery);
    return;
  }

  const jqueryScript = document.createElement("script");
  jqueryScript.src = "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js";
  jqueryScript.onload = function () {
    initializeEffects(window.jQuery);
  };
  jqueryScript.onerror = function () {
    console.error("Could not load jQuery. Interactive tools are unavailable.");
    const feedback = document.getElementById("progress-feedback");
    if (feedback) feedback.textContent = "Interactive tools could not load. Check your internet connection.";
  };
  document.head.appendChild(jqueryScript);
})();

function initializeEffects($) {
  $(function () {
    const quotes = [
      { text: "You don’t have to see the whole staircase. Just take the first step.", author: "MARTIN LUTHER KING JR." },
      { text: "Great things are done by a series of small things brought together.", author: "VINCENT VAN GOGH" },
      { text: "It always seems impossible until it’s done.", author: "NELSON MANDELA" },
      { text: "The secret of getting ahead is getting started.", author: "MARK TWAIN" }
    ];
    let quoteIndex = 0;
    let wins = 0;
    let secondsLeft = 25 * 60;
    let timerId = null;

    $("#new-quote").on("click", function () {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      $("#quote-text").text(quotes[quoteIndex].text);
      $("#quote-author").text("— " + quotes[quoteIndex].author);
    });

    $("#log-win").on("click", function () {
      if (wins >= 5) {
        $("#progress-feedback").text("You did it. Take a moment to celebrate.");
        return;
      }

      wins += 1;
      $("#progress-count").text(wins);
      $(".progress-fill").css("width", (wins / 5) * 100 + "%");
      $(".progress-track").attr("aria-valuenow", wins);
      $("#progress-feedback").text(wins === 5 ? "Five small wins. Look how far you’ve come." : "Nice work. That’s one more step forward.");
    });

    $("#goal-form").on("submit", function (event) {
      event.preventDefault();
      const $input = $("#goal-input");
      const goal = $input.val().trim();

      if (!goal) {
        $input.trigger("focus");
        return;
      }

      const $goal = $("<li>");
      $("<span>").text(goal).appendTo($goal);
      $("<button>", {
        type: "button",
        "aria-label": "Remove " + goal,
        text: "×"
      }).appendTo($goal);
      $("#goal-list").append($goal);
      $input.val("").trigger("focus");
    });

    $("#goal-list").on("click", "button", function () {
      $(this).closest("li").remove();
    });

    function renderTimer() {
      const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
      const seconds = (secondsLeft % 60).toString().padStart(2, "0");
      const label = minutes + " minutes " + seconds + " seconds";
      $("#timer-display").text(minutes + ":" + seconds).attr("aria-label", label);
    }

    $("#timer-toggle").on("click", function () {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        $(this).text("RESUME FOCUS");
        $("#timer-feedback").text("Paused. Pick it back up when you’re ready.");
        return;
      }

      if (secondsLeft === 0) secondsLeft = 25 * 60;
      $(this).text("PAUSE FOCUS");
      $("#timer-feedback").text("You’ve got this. Stay with one thing.");
      timerId = setInterval(function () {
        secondsLeft -= 1;
        renderTimer();
        if (secondsLeft === 0) {
          clearInterval(timerId);
          timerId = null;
          $("#timer-toggle").text("START AGAIN");
          $("#timer-feedback").text("Focus session complete. Well done.");
        }
      }, 1000);
    });

    $("#timer-reset").on("click", function () {
      if (timerId !== null) clearInterval(timerId);
      timerId = null;
      secondsLeft = 25 * 60;
      renderTimer();
      $("#timer-toggle").text("START FOCUS");
      $("#timer-feedback").text("Twenty-five minutes. Just for you.");
    });

    $(".path-toggle").on("click", function () {
      const $button = $(this);
      const isExpanded = $button.attr("aria-expanded") === "true";
      $button.attr("aria-expanded", String(!isExpanded));
      $("#" + $button.attr("aria-controls")).prop("hidden", isExpanded);
    });
  });
}
