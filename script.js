(() => {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const mainContent = document.getElementById('main-content');
  const navLinks = document.querySelectorAll('nav.sidebar a.nav-link');
  let currentYear = '2023';

  // Toggle sidebar
  menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      mainContent.classList.add('full-width');
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      sidebar.classList.add('open');
      mainContent.classList.remove('full-width');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  });

  // Navigation switching sections
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show section, hide others
      const sections = document.querySelectorAll('main .section');
      sections.forEach(section => {
        if(section.id === link.dataset.section){
          section.hidden = false;
          section.classList.add('active-section');
          section.setAttribute('tabindex', '-1');
          section.focus();
        } else {
          section.hidden = true;
          section.classList.remove('active-section');
          section.removeAttribute('tabindex');
        }
      });

      // Close sidebar on mobile after click
      if(window.innerWidth <= 900){
        sidebar.classList.remove('open');
        mainContent.classList.add('full-width');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Example data for charts
  const monthlySalesData = {
    2021: [12000, 15000, 14000, 16000, 17000, 18000, 21000, 21500, 22000, 25000, 27000, 30000],
    2022: [13000, 16500, 15500, 18500, 19000, 21000, 25000, 26000, 27000, 29000, 31000, 35000],
    2023: [14000, 17000, 16500, 19500, 20000, 23000, 28000, 29000, 30000, 32000, 35000, 40000],
  };

  const productDistributionData = {
    labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'],
    data: [35, 25, 15, 15, 10],
  };

  // Chart instances
  let monthlySalesChart;
  let productDistributionChart;

  // Initialize charts
  function initCharts() {
    const ctxSales = document.getElementById('monthly-sales-chart').getContext('2d');
    const ctxProducts = document.getElementById('product-distribution-chart').getContext('2d');

    monthlySalesChart = new Chart(ctxSales, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Vendas (R$)',
          data: monthlySalesData[currentYear],
          backgroundColor: '#3f51b5',
          borderRadius: 6,
          maxBarThickness: 48,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => 'R$ ' + ctx.parsed.y.toLocaleString('pt-BR')
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => 'R$ ' + value.toLocaleString('pt-BR'),
              stepSize: 5000,
              maxTicksLimit: 6
            },
            grid: {
              color: '#e3e3e3'
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });

    productDistributionChart = new Chart(ctxProducts, {
      type: 'pie',
      data: {
        labels: productDistributionData.labels,
        datasets: [{
          data: productDistributionData.data,
          backgroundColor: ['#3f51b5', '#ffca28', '#f44336', '#4caf50', '#9c27b0'],
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 18,
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => ctx.label + ': ' + ctx.parsed + '%'
            }
          }
        }
      }
    });
  }

  // Update sales chart on year change
  const yearSelect = document.getElementById('year-select');
  yearSelect.addEventListener('change', (e) => {
    currentYear = e.target.value;
    monthlySalesChart.data.datasets[0].data = monthlySalesData[currentYear];
    monthlySalesChart.update();
  });

  // Accessibility: close sidebar if escape key pressed and sidebar is open
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && sidebar.classList.contains('open')){
      sidebar.classList.remove('open');
      mainContent.classList.add('full-width');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });

  // Handle window resize to auto close sidebar on larger screen
  window.addEventListener('resize', () => {
    if(window.innerWidth > 900){
      sidebar.classList.remove('closed');
      sidebar.classList.remove('open');
      mainContent.classList.remove('full-width');
    } else {
      sidebar.classList.add('closed');
      mainContent.classList.add('full-width');
    }
  });

  // Setup initial layout for sidebar on load
  if(window.innerWidth > 900){
    sidebar.classList.remove('closed');
    mainContent.classList.remove('full-width');
  } else {
    sidebar.classList.add('closed');
    mainContent.classList.add('full-width');
  }

  // Initialize everything on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initCharts();
  });
})();