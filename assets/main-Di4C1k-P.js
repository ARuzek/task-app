import"./modulepreload-polyfill-B5Qt9EMX.js";function c(){return localStorage.getItem("userId")}function x(e){localStorage.setItem("userId",e);const t=b();t&&localStorage.setItem("nickname-"+e,t)}function b(){return localStorage.getItem("nickname")}function v(e){localStorage.setItem("nickname",e)}function T(){if(c())return;let e="";for(;!e;)e=prompt("Enter your nickname for the app (will be shown on the leaderboard):"),e&&v(e.trim())}function I(){document.querySelector("#app").innerHTML=`
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
  `,window.componentHandler&&window.componentHandler.upgradeDom(),N(),L(),J()}function N(){const e=document.getElementById("show-task-form"),t=document.getElementById("task-form"),o=document.getElementById("task-status");e.onclick=()=>{t.style.display="block"},t.onsubmit=l=>{l.preventDefault();const n=Object.fromEntries(new FormData(t));n.people=parseInt(n.people),n.id="task-"+Date.now(),n.requester=c(),n.accepted=[],n.pending=[],_(n),o.textContent="Task created! Sending to users...",t.reset(),t.style.display="none",w(n)}}function _(e){const t=JSON.parse(localStorage.getItem("tasks")||"[]");t.push(e),localStorage.setItem("tasks",JSON.stringify(t))}function h(){return JSON.parse(localStorage.getItem("tasks")||"[]")}function $(){const e=["user1","user2","user3","user4","user5"],t=c();return e.includes(t)?e:[t,...e]}function E(e,t){const o=$();for(let l=o.length-1;l>0;l--){const n=Math.floor(Math.random()*(l+1));[o[l],o[n]]=[o[n],o[l]]}return o.slice(0,e)}function w(e){const t=e.people,o=E(t*2,e.requester);let l=0;function n(){if(e.accepted.length>=t||l>=o.length)return;const a=o[l++];H(a,e.id),n()}n()}function H(e,t){const o=JSON.parse(localStorage.getItem("inbox-"+e)||"[]");if(!o.includes(t)&&(o.push(t),localStorage.setItem("inbox-"+e,JSON.stringify(o)),e===c())){const n=h().find(a=>a.id===t);n&&g("New Task Assigned",`${n.title} at ${n.where} on ${n.when}`)}}function L(){const e=c(),t=document.getElementById("inbox-list"),o=t.parentElement,l="inbox-table";let n=document.getElementById(l);n||(n=document.createElement("table"),n.id=l,o.replaceChild(n,t));function a(){const u=JSON.parse(localStorage.getItem("inbox-"+e)||"[]"),d=h();n.innerHTML="<thead><tr><th>Task</th><th>Date</th><th>Status/Action</th></tr></thead><tbody></tbody>";const r=n.querySelector("tbody");d.filter(i=>i.accepted&&i.accepted.includes(e)).forEach(i=>{const s=C(i),m=document.createElement("tr");m.innerHTML=`
        <td><b>${i.title}</b> at ${i.where}</td>
        <td>${S(i.when)}</td>
        <td class="status-cell"><span class="mdl-chip"><span class="mdl-chip__text">${s}</span></span></td>
      `,r.appendChild(m)}),u.forEach(i=>{const s=d.find(y=>y.id===i);if(!s||s.accepted&&s.accepted.includes(e))return;const m=document.createElement("tr"),p=document.createElement("td");p.className="status-cell",p.innerHTML=`
        <button data-accept class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Accept</button>
        <button data-decline class="mdl-button mdl-js-button mdl-button--raised">Decline</button>
      `,m.innerHTML=`
        <td><b>${s.title}</b> at ${s.where}</td>
        <td>${S(s.when)}</td>
      `,m.appendChild(p),r.appendChild(m),p.querySelector("[data-accept]").onclick=()=>M(s,e),p.querySelector("[data-decline]").onclick=()=>D(s,e)}),window.componentHandler&&window.componentHandler.upgradeDom()}a(),setInterval(a,5e3)}function S(e){const t=new Date(e),o=String(t.getMonth()+1).padStart(2,"0"),l=String(t.getDate()).padStart(2,"0");let n=t.getHours();const a=String(t.getMinutes()).padStart(2,"0"),u=n>=12?"PM":"AM";return n=n%12,n===0&&(n=12),`${o}/${l} ${n}:${a} ${u}`}function C(e){const t=new Date,o=new Date(e.when);return t<o||t<new Date(o.getTime()+60*60*1e3)?"In Progress":"Complete"}function M(e,t){e.accepted.includes(t)||(e.accepted.length<e.people?(e.accepted.push(t),f(t,e.id),O(e),j(t,5),g("Task Accepted","You have been accepted for this task!")):(f(t,e.id),g("Task Full","Sorry, enough people have already accepted this task. Thank you!")))}function D(e,t){f(t,e.id),w(e)}function f(e,t){let o=JSON.parse(localStorage.getItem("inbox-"+e)||"[]");o=o.filter(l=>l!==t),localStorage.setItem("inbox-"+e,JSON.stringify(o))}function O(e){const t=h(),o=t.findIndex(l=>l.id===e.id);o!==-1&&(t[o]=e,localStorage.setItem("tasks",JSON.stringify(t)))}function k(){return JSON.parse(localStorage.getItem("leaderboard")||"{}")}function q(e){localStorage.setItem("leaderboard",JSON.stringify(e))}function j(e,t){const o=k();o[e]=(o[e]||0)+t,q(o)}function J(){const e=document.getElementById("leaderboard-list");function t(){const o=k(),l=Object.entries(o).sort((n,a)=>a[1]-n[1]);e.innerHTML="",l.forEach(([n,a],u)=>{let d=localStorage.getItem("nickname-"+n);!d&&n===c()&&(d=b()),d||(d=n);const r=document.createElement("li");r.className="mdl-list__item",r.innerHTML=`<span class="mdl-list__item-primary-content">${u+1}. <b>${d}</b> — ${a} pts</span>`,e.appendChild(r)}),window.componentHandler&&window.componentHandler.upgradeDom()}t(),setInterval(t,5e3)}function g(e,t){Notification.permission==="granted"&&new Notification(e,{body:t})}Notification&&Notification.permission!=="granted"&&Notification.requestPermission();!c()&&window.location.hostname==="localhost"&&x("devuser");c()?(b()||T(),I()):document.querySelector("#app").innerHTML='<a href="login.html">Login via QR Code</a>';
