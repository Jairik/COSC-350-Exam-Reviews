(function () {
  function keyFor(questionId) {
    return "cosc350-question-bank-" + questionId;
  }

  function normalizeHeadingText(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function isQuestionBankPage() {
    var path = (window.location.pathname || "").replace(/\/+$/, "");
    return /\/question-bank(?:\/index\.html)?$/.test(path);
  }

  function ensureProgressWidget(contentRoot) {
    if (document.getElementById("qa-progress")) {
      return;
    }

    var progress = document.createElement("div");
    progress.id = "qa-progress";
    progress.className = "qa-progress";

    var label = document.createElement("strong");
    label.textContent = "Progress:";

    var done = document.createElement("span");
    done.id = "qa-progress-count";
    done.textContent = "0";

    var total = document.createElement("span");
    total.id = "qa-progress-total";
    total.textContent = "0";

    progress.appendChild(label);
    progress.appendChild(document.createTextNode(" "));
    progress.appendChild(done);
    progress.appendChild(document.createTextNode("/"));
    progress.appendChild(total);
    progress.appendChild(document.createTextNode(" marked correct"));

    var pageTitle = contentRoot.querySelector("h1");
    if (pageTitle) {
      pageTitle.insertAdjacentElement("afterend", progress);
      return;
    }

    contentRoot.prepend(progress);
  }

  function buildQuestionCards() {
    if (!isQuestionBankPage()) {
      return false;
    }

    var contentRoot = document.querySelector(".wy-nav-content .rst-content") || document.querySelector("main") || document.body;
    ensureProgressWidget(contentRoot);
    var headings = Array.from(contentRoot.querySelectorAll("h3"));
    if (!headings.length) {
      return false;
    }

    headings.forEach(function (heading, index) {
      var questionId = String(index + 1).padStart(2, "0");
      var details = document.createElement("details");
      details.className = "qa-card";
      var headingId = heading.getAttribute("id");
      if (headingId) {
        details.id = headingId;
      }

      var summary = document.createElement("summary");
      var badge = document.createElement("span");
      badge.className = "qa-number";
      badge.textContent = "Q" + questionId;
      summary.appendChild(badge);
      summary.append(document.createTextNode(normalizeHeadingText(heading.textContent)));
      details.appendChild(summary);

      var body = document.createElement("div");
      body.className = "qa-body";

      var cursor = heading.nextSibling;
      while (cursor) {
        var next = cursor.nextSibling;
        var stop = cursor.nodeType === Node.ELEMENT_NODE && (/^H[23]$/.test(cursor.tagName) || cursor.tagName === "HR");
        if (stop) {
          if (cursor.tagName === "HR") {
            cursor.remove();
          }
          break;
        }
        body.appendChild(cursor);
        cursor = next;
      }

      var row = document.createElement("label");
      row.className = "qa-correct-row";
      var toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.className = "qa-correct-toggle";
      toggle.dataset.questionId = questionId;

      var rowText = document.createElement("span");
      rowText.textContent = "I got this correct";
      row.appendChild(toggle);
      row.appendChild(rowText);

      var status = document.createElement("p");
      status.className = "qa-checkmark";
      status.dataset.questionId = questionId;

      body.appendChild(row);
      body.appendChild(status);
      details.appendChild(body);

      heading.replaceWith(details);
    });

    return true;
  }

  function updateProgress() {
    var toggles = Array.from(document.querySelectorAll(".qa-correct-toggle"));
    var done = toggles.filter(function (toggle) { return toggle.checked; }).length;

    var totalEl = document.getElementById("qa-progress-total");
    var doneEl = document.getElementById("qa-progress-count");

    if (totalEl) {
      totalEl.textContent = String(toggles.length);
    }

    if (doneEl) {
      doneEl.textContent = String(done);
    }
  }

  function updateCheckState(toggle) {
    var questionId = toggle.dataset.questionId;
    var status = document.querySelector('.qa-checkmark[data-question-id="' + questionId + '"]');
    var card = toggle.closest(".qa-card");

    if (toggle.checked) {
      if (status) {
        status.textContent = "[x] Correct";
      }
      if (card) {
        card.classList.add("qa-complete");
      }
    } else {
      if (status) {
        status.textContent = "";
      }
      if (card) {
        card.classList.remove("qa-complete");
      }
    }

    updateProgress();
  }

  function restoreAndBind() {
    var toggles = Array.from(document.querySelectorAll(".qa-correct-toggle"));

    toggles.forEach(function (toggle) {
      var questionId = toggle.dataset.questionId;
      var saved = localStorage.getItem(keyFor(questionId));
      toggle.checked = saved === "true";

      updateCheckState(toggle);

      toggle.addEventListener("change", function () {
        localStorage.setItem(keyFor(questionId), String(toggle.checked));
        updateCheckState(toggle);
      });
    });

    updateProgress();
  }

  function initQuestionBank() {
    if (!buildQuestionCards()) {
      return;
    }
    restoreAndBind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initQuestionBank);
  } else {
    initQuestionBank();
  }
})();
