// Load profile into account settings form
function getToken(){ return apiClient.getToken(); }

function fillInput(selector, value){ const el=document.querySelector(selector); if (el) el.value = value||''; }

async function loadAccount(){
  if(!getToken()){ window.location.href = '../login/index.html'; return; }
  try{
    const profile = await fetch(`${apiClient.BASE_URL}/api/users/profile`,{ headers:{ Authorization:`Bearer ${getToken()}` } }).then(r=>r.json());
    fillInput('input[placeholder="Jordan Smith"]', profile.fullName);
    fillInput('input[placeholder="jordan@example.com"]', profile.email);
    fillInput('input[placeholder="+1 (555) 123-4567"]', profile.mobile);
  }catch(e){ console.error('Failed to load account', e); }
}

function toast(msg){ const d=document.createElement('div'); d.style.cssText='position:fixed;top:20px;right:20px;background:#10b981;color:#fff;padding:10px 14px;border-radius:6px;z-index:9999'; d.textContent=msg; document.body.appendChild(d); setTimeout(()=>d.remove(),2500); }

window.addEventListener('load', loadAccount);

document.addEventListener('click', async (e)=>{
  if(e.target && e.target.id==='saveAccountBtn'){
    e.preventDefault();
    try{
      const fullNameEl = document.querySelector('input[placeholder="Jordan Smith"]');
      const emailEl = document.querySelector('input[placeholder="jordan@example.com"]');
      const mobileEl = document.querySelector('input[placeholder="+1 (555) 123-4567"]');
      const payload = {
        fullName: fullNameEl?.value?.trim() || undefined,
        email: emailEl?.value?.trim() || undefined,
        mobile: mobileEl?.value?.trim() || undefined
      };
      // Remove undefined keys
      Object.keys(payload).forEach(k=> payload[k]===undefined && delete payload[k]);
      await apiClient.user.updateProfile(payload);
      toast('Profile updated successfully');
    }catch(err){ console.error(err); toast('Failed to update profile: '+err.message); }
  }
  if(e.target && e.target.id==='updatePasswordBtn'){
    e.preventDefault();
    toast('Password update is not available in this version.');
  }
});
