(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();function r(){return localStorage.getItem("userId")}function x(e){localStorage.setItem("userId",e);const t=b();t&&localStorage.setItem("nickname-"+e,t)}function b(){return localStorage.getItem("nickname")}function k(e){localStorage.setItem("nickname",e)}function T(){let e="";for(;!e;)e=prompt("Enter your nickname for the app (will be shown on the leaderboard):"),e&&k(e.trim())}function I(){document.querySelector("#app").innerHTML=`
    <div class="mdl-grid">
      <div class="mdl-cell">
        <div class="mdl-card mdl-shadow--2dp" style="padding:2em;">
          <h2 class="mdl-card__title-text">Create a Task</h2>
          <span id="task-title-spacer"></span>
          <button id="show-task-form" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Create Task</button>
          <form id="task-form" class="mdl-grid" style="display:none; margin-top:1em;">
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="title" required placeholder="Title">
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="people" type="number" min="1" required placeholder="How many people?">
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="where" required placeholder="Where?">
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="when" type="datetime-local" required>
            </div>
            <div class="mdl-cell mdl-cell--12-col">
              <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Submit Task</button>
            </div>
          </form>
          <div id="task-status" style="margin-top:1em;"></div>
        </div>
      </div>
      <div class="mdl-cell">
        <div class="mdl-card mdl-shadow--2dp" style="padding:2em;">
          <h2 class="mdl-card__title-text">Tasks for You</h2>
          <div id="inbox-list"></div>
        </div>
      </div>
      <div class="mdl-cell">
        <div class="mdl-card mdl-shadow--2dp" style="padding:2em;">
          <h2 class="mdl-card__title-text">Leaderboard</h2>
          <ol id="leaderboard-list" class="mdl-list"></ol>
        </div>
      </div>
    </div>
  `,window.componentHandler&&window.componentHandler.upgradeDom(),N(),$(),J()}function N(){const e=document.getElementById("show-task-form"),t=document.getElementById("task-form"),o=document.getElementById("task-status");e.onclick=()=>{t.style.display="block"},t.onsubmit=l=>{l.preventDefault();const n=Object.fromEntries(new FormData(t));n.people=parseInt(n.people),n.id="task-"+Date.now(),n.requester=r(),n.accepted=[],n.pending=[],L(n),o.textContent="Task created! Sending to users...",t.reset(),t.style.display="none",S(n)}}function L(e){const t=JSON.parse(localStorage.getItem("tasks")||"[]");t.push(e),localStorage.setItem("tasks",JSON.stringify(t))}function h(){return JSON.parse(localStorage.getItem("tasks")||"[]")}function _(){const e=["user1","user2","user3","user4","user5"],t=r();return e.includes(t)?e:[t,...e]}function O(e,t){const o=_();for(let l=o.length-1;l>0;l--){const n=Math.floor(Math.random()*(l+1));[o[l],o[n]]=[o[n],o[l]]}return o.slice(0,e)}function S(e){const t=e.people,o=O(t*2,e.requester);let l=0;function n(){if(e.accepted.length>=t||l>=o.length)return;const s=o[l++];E(s,e.id),n()}n()}function E(e,t){const o=JSON.parse(localStorage.getItem("inbox-"+e)||"[]");if(!o.includes(t)&&(o.push(t),localStorage.setItem("inbox-"+e,JSON.stringify(o)),e===r())){const n=h().find(s=>s.id===t);n&&g("New Task Assigned",`${n.title} at ${n.where} on ${n.when}`)}}function $(){const e=r(),t=document.getElementById("inbox-list"),o=t.parentElement,l="inbox-table";let n=document.getElementById(l);n||(n=document.createElement("table"),n.id=l,o.replaceChild(n,t));function s(){const a=JSON.parse(localStorage.getItem("inbox-"+e)||"[]"),c=h();n.innerHTML="<thead><tr><th>Task</th><th>Date</th><th>Status/Action</th></tr></thead><tbody></tbody>";const m=n.querySelector("tbody");c.filter(d=>d.accepted&&d.accepted.includes(e)).forEach(d=>{const i=H(d),u=document.createElement("tr");u.innerHTML=`
        <td><b>${d.title}</b> at ${d.where}</td>
        <td>${y(d.when)}</td>
        <td class="status-cell"><span class="mdl-chip"><span class="mdl-chip__text">${i}</span></span></td>
      `,m.appendChild(u)}),a.forEach(d=>{const i=c.find(v=>v.id===d);if(!i||i.accepted&&i.accepted.includes(e))return;const u=document.createElement("tr"),p=document.createElement("td");p.className="status-cell",p.innerHTML=`
        <button data-accept class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Accept</button>
        <button data-decline class="mdl-button mdl-js-button mdl-button--raised">Decline</button>
      `,u.innerHTML=`
        <td><b>${i.title}</b> at ${i.where}</td>
        <td>${y(i.when)}</td>
      `,u.appendChild(p),m.appendChild(u),p.querySelector("[data-accept]").onclick=()=>M(i,e),p.querySelector("[data-decline]").onclick=()=>C(i,e)}),window.componentHandler&&window.componentHandler.upgradeDom()}s(),setInterval(s,5e3)}function y(e){const t=new Date(e),o=String(t.getMonth()+1).padStart(2,"0"),l=String(t.getDate()).padStart(2,"0");let n=t.getHours();const s=String(t.getMinutes()).padStart(2,"0"),a=n>=12?"PM":"AM";return n=n%12,n===0&&(n=12),`${o}/${l} ${n}:${s} ${a}`}function H(e){const t=new Date,o=new Date(e.when);return t<o||t<new Date(o.getTime()+60*60*1e3)?"In Progress":"Complete"}function M(e,t){e.accepted.includes(t)||(e.accepted.length<e.people?(e.accepted.push(t),f(t,e.id),D(e),j(t,5),g("Task Accepted","You have been accepted for this task!")):(f(t,e.id),g("Task Full","Sorry, enough people have already accepted this task. Thank you!")))}function C(e,t){f(t,e.id),S(e)}function f(e,t){let o=JSON.parse(localStorage.getItem("inbox-"+e)||"[]");o=o.filter(l=>l!==t),localStorage.setItem("inbox-"+e,JSON.stringify(o))}function D(e){const t=h(),o=t.findIndex(l=>l.id===e.id);o!==-1&&(t[o]=e,localStorage.setItem("tasks",JSON.stringify(t)))}function w(){return JSON.parse(localStorage.getItem("leaderboard")||"{}")}function q(e){localStorage.setItem("leaderboard",JSON.stringify(e))}function j(e,t){const o=w();o[e]=(o[e]||0)+t,q(o)}function J(){const e=document.getElementById("leaderboard-list");function t(){const o=w(),l=Object.entries(o).sort((n,s)=>s[1]-n[1]);e.innerHTML="",l.forEach(([n,s],a)=>{let c=localStorage.getItem("nickname-"+n);!c&&n===r()&&(c=b()),c||(c=n);const m=document.createElement("li");m.className="mdl-list__item",m.innerHTML=`<span class="mdl-list__item-primary-content">${a+1}. <b>${c}</b> — ${s} pts</span>`,e.appendChild(m)}),window.componentHandler&&window.componentHandler.upgradeDom()}t(),setInterval(t,5e3)}function g(e,t){Notification.permission==="granted"&&new Notification(e,{body:t})}Notification&&Notification.permission!=="granted"&&Notification.requestPermission();!r()&&window.location.hostname==="localhost"&&x("devuser");r()?(b()||T(),I()):document.querySelector("#app").innerHTML='<a href="login.html">Login via QR Code</a>';
