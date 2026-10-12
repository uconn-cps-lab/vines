/**
 * VINES Project Website Scripts
 * NSF-SRC Track 1: Towards Resilient and Converged NextG Manufacturing Systems
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSubstrateTabs();
  initPublications();
  initBibtexModal();
  initReplicaToggle();
});

/* --------------------------------------------------------------------------
   Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = navMenu.style.display === 'flex';
      navMenu.style.display = isExpanded ? 'none' : 'flex';
      if (!isExpanded) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#ffffff';
        navMenu.style.padding = '20px';
        navMenu.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Substrate Architecture Tabs
   -------------------------------------------------------------------------- */
function initSubstrateTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.substrate-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSubstrate = btn.getAttribute('data-substrate');

      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${targetSubstrate}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Publications Filtering & Search
   -------------------------------------------------------------------------- */
function initPublications() {
  const searchInput = document.getElementById('pubSearch');
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubItems = document.querySelectorAll('.pub-item');

  let activeTag = 'all';
  let searchQuery = '';

  function filterPubs() {
    pubItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const tags = (item.getAttribute('data-tags') || '').toLowerCase();

      const matchesTag = activeTag === 'all' || tags.includes(activeTag.toLowerCase());
      const matchesSearch = searchQuery === '' || text.includes(searchQuery);

      if (matchesTag && matchesSearch) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterPubs();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTag = btn.getAttribute('data-tag');
      filterPubs();
    });
  });
}

/* --------------------------------------------------------------------------
   BibTeX Modal & Copy
   -------------------------------------------------------------------------- */
const bibtexDatabase = {
  "nsdi26": `@inproceedings{keepon2026,
  author    = {Xue, Chuanyu and Zhang, Tianyu and Han, Song},
  title     = {KeepON: Supporting Deterministic Traffic on Standard NICs},
  booktitle = {Proceedings of the 23rd USENIX Symposium on Networked Systems Design and Implementation (NSDI '26)},
  year      = {2026},
  url       = {https://www.usenix.org/conference/nsdi26}
}`,
  "rtss26": `@inproceedings{bwp2026,
  author    = {Zhang, Tianyu and Han, Song and Zhou, Shengli and Wang, Bing},
  title     = {BWP-aware Real-Time Scheduling for Heterogeneous UEs in Industrial 5G Systems},
  booktitle = {Proceedings of the 47th IEEE Real-Time Systems Symposium (RTSS '26)},
  year      = {2026}
}`,
  "rtss25": `@inproceedings{tsnkit2025,
  author    = {Xue, Chuanyu and Zhang, Tianyu and Han, Song},
  title     = {TSNKit: An Open Source TSN Scheduling Evaluation Tool},
  booktitle = {Proceedings of the 46th IEEE Real-Time Systems Symposium (RTSS '25 - Brief Presentation)},
  year      = {2025},
  url       = {https://github.com/ChuanyuXue/tsnkit}
}`,
  "tmc25": `@article{5gtps2025,
  author    = {Zhang, Tianyu and Xue, Chuanyu and Han, Song},
  title     = {5G-TPS: A Two-Phase Real-Time Scheduling and Adaptation Framework for 5G Radio Access Networks},
  journal   = {IEEE Transactions on Mobile Computing (TMC)},
  year      = {2025},
  doi       = {10.1109/TMC.2025.11129907}
}`,
  "csur25": `@article{csur2025tsn,
  author    = {Zhang, Tianyu and Gidlund, Mikael and Han, Song},
  title     = {A Survey and Experimental Study of Real-Time Scheduling Methods for 802.1Qbv TSN Networks},
  journal   = {ACM Computing Surveys (CSUR)},
  year      = {2025},
  doi       = {10.1145/3736715}
}`,
  "rtas24": `@inproceedings{rtas2024tsn,
  author    = {Zhang, Tianyu and Xue, Chuanyu and Han, Song},
  title     = {Real-Time Scheduling for 802.1Qbv Time-Sensitive Networking (TSN): A Systematic Review and Experimental Study},
  booktitle = {Proceedings of the 30th IEEE Real-Time and Embedded Technology and Applications Symposium (RTAS '24)},
  year      = {2024}
}`
};

function initBibtexModal() {
  const modal = document.getElementById('bibtexModal');
  const codeBlock = document.getElementById('bibtexCode');
  const closeBtn = document.getElementById('modalCloseBtn');
  const copyBtn = document.getElementById('modalCopyBtn');
  const bibtexBtns = document.querySelectorAll('.btn-bibtex');

  if (!modal || !codeBlock) return;

  bibtexBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-bibtex-id');
      const bibtex = bibtexDatabase[id] || '% BibTeX entry not found';
      codeBlock.textContent = bibtex;
      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   Replica Toggle (PDF vs HTML Quad Chart)
   -------------------------------------------------------------------------- */
function initReplicaToggle() {
  const toggleBtn = document.getElementById('toggleReplicaBtn');
  const replica = document.getElementById('quadHtmlReplica');
  const pdfContainer = document.querySelector('.quad-pdf-frame-container');

  if (toggleBtn && replica && pdfContainer) {
    toggleBtn.addEventListener('click', () => {
      const isReplicaVisible = replica.style.display !== 'none';
      if (isReplicaVisible) {
        replica.style.display = 'none';
        pdfContainer.style.display = 'block';
        toggleBtn.textContent = 'Show Accessible HTML Layout';
      } else {
        replica.style.display = 'block';
        pdfContainer.style.display = 'none';
        toggleBtn.textContent = 'Show PDF Poster View';
      }
    });
  }
}
