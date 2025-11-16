/*
  ========================================
  SCRIPT.JS - FUNCIONALIDADES INTERATIVAS
  Dra. Isabela Moreira - Odontologia de Excelência
  ========================================

  Desenvolvido por: Hudson Oliveira | HO DEVWEB
  JavaScript Vanilla (ES6+)

  Funcionalidades:
  - Menu hamburger animado
  - Smooth scroll
  - Sticky header com blur
  - Indicador de seção ativa
  - Lightbox para galeria
  - Carousel de depoimentos
  - Accordion FAQ
  - Validação de formulário
  - Botão voltar ao topo
  - Animações ao scroll
  - Lazy loading de imagens
  - Máscara de telefone
*/

'use strict';

/* ========================================
   1. MENU HAMBURGER & NAVEGAÇÃO MOBILE
   ======================================== */

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
const body = document.body;

// Toggle menu mobile
function toggleMobileMenu() {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Event listener para hamburger
if (hamburger) {
  hamburger.addEventListener('click', toggleMobileMenu);
}

// Fechar menu ao clicar em um link
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// Fechar menu ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
    toggleMobileMenu();
  }
});

/* ========================================
   2. STICKY HEADER COM BLUR & SCROLL
   ======================================== */

const header = document.querySelector('.header');

function handleStickyHeader() {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleStickyHeader);

/* ========================================
   3. SMOOTH SCROLL & INDICADOR SEÇÃO ATIVA
   ======================================== */

const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
const sections = document.querySelectorAll('section[id]');

// Smooth scroll ao clicar em links de navegação
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Indicador de seção ativa
function updateActiveSection() {
  const scrollPosition = window.scrollY + header.offsetHeight + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveSection);

/* ========================================
   4. GALERIA LIGHTBOX (MODAL)
   ======================================== */

const portfolioCards = document.querySelectorAll('.portfolio-card');
const modal = document.getElementById('portfolioModal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalTime = document.getElementById('modalTime');
const modalTechnique = document.getElementById('modalTechnique');
const modalBeforeImage = document.getElementById('modalBeforeImage');
const modalAfterImage = document.getElementById('modalAfterImage');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');

let currentCaseIndex = 0;

// Dados dos casos (em produção real viriam de uma API ou CMS)
const casesData = [
  {
    title: 'Smile Makeover Completo',
    description: 'Transformação total com 20 laminados cerâmicos ultrafinos em porcelana IPS e.max. Paciente apresentava dentes desgastados, manchados e desalinhados. Resultado: sorriso harmônico, natural e radiante.',
    time: '3 semanas',
    technique: 'Laminados Cerâmicos Premium + DSD',
    beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1606811851955-ce4d0bdfa6df?w=800&h=600&fit=crop'
  },
  {
    title: 'Harmonização Facial 360°',
    description: 'Protocolo integrado de harmonização orofacial combinando toxina botulínica, preenchimento labial e ácido hialurônico no terço médio. Resultado natural, elegante e rejuvenescido.',
    time: '1 sessão (2h)',
    technique: 'Toxina Botulínica + Ácido Hialurônico',
    beforeImage: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop'
  },
  {
    title: 'Reabilitação Full Arch',
    description: 'Protocolo completo em implantes Straumann com carga imediata. Paciente edêntulo total recebeu prótese protocolo fixa em menos de 24h. Transformação de vida extraordinária.',
    time: '6 meses (protocolo completo)',
    technique: 'Implantes Straumann + Protocolo All-on-4',
    beforeImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop'
  },
  {
    title: 'Lentes Minimamente Invasivas',
    description: 'Lentes de contato dental sem desgaste (técnica no-prep). Espessura de apenas 0,2mm. Correção de diastemas e formato dental com preservação total da estrutura natural.',
    time: '2 semanas',
    technique: 'Lentes Ultrafinas No-Prep',
    beforeImage: 'https://images.unsplash.com/photo-1609086572737-de9baa6290ff?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop'
  },
  {
    title: 'Implantes Zona Estética',
    description: 'Implante unitário em incisivo central superior com enxerto de gengiva e técnica de perfil emergente personalizado. Resultado imperceptível, idêntico aos dentes naturais adjacentes.',
    time: '5 meses',
    technique: 'Implante Premium + Enxerto Gengival + Coroa Cerâmica',
    beforeImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&h=600&fit=crop'
  },
  {
    title: 'Clareamento Premium + Facetas',
    description: 'Combinação de clareamento profissional de consultório com facetas cerâmicas nos 10 dentes anteriores. Branqueamento intenso e correção de formato para sorriso cinematográfico.',
    time: '3 semanas',
    technique: 'Clareamento a Laser + Facetas e.max',
    beforeImage: 'https://images.unsplash.com/photo-1606811851955-ce4d0bdfa6df?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop'
  }
];

// Abrir modal
function openModal(index) {
  currentCaseIndex = index;
  updateModalContent();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  body.style.overflow = 'hidden';
}

// Fechar modal
function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
}

// Atualizar conteúdo do modal
function updateModalContent() {
  const currentCase = casesData[currentCaseIndex];
  modalTitle.textContent = currentCase.title;
  modalDescription.textContent = currentCase.description;
  modalTime.textContent = currentCase.time;
  modalTechnique.textContent = currentCase.technique;
  modalBeforeImage.src = currentCase.beforeImage;
  modalBeforeImage.alt = `Antes - ${currentCase.title}`;
  modalAfterImage.src = currentCase.afterImage;
  modalAfterImage.alt = `Depois - ${currentCase.title}`;
}

// Navegação modal
function showPrevCase() {
  currentCaseIndex = (currentCaseIndex - 1 + casesData.length) % casesData.length;
  updateModalContent();
}

function showNextCase() {
  currentCaseIndex = (currentCaseIndex + 1) % casesData.length;
  updateModalContent();
}

// Event listeners para galeria
portfolioCards.forEach((card, index) => {
  card.addEventListener('click', () => openModal(index));
});

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', closeModal);
}

if (modalPrev) {
  modalPrev.addEventListener('click', showPrevCase);
}

if (modalNext) {
  modalNext.addEventListener('click', showNextCase);
}

// Fechar modal com ESC e navegar com setas
document.addEventListener('keydown', (e) => {
  if (modal.classList.contains('active')) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showPrevCase();
    if (e.key === 'ArrowRight') showNextCase();
  }
});

/* ========================================
   5. CAROUSEL DE DEPOIMENTOS
   ======================================== */

const testimonialsTrack = document.querySelector('.testimonials-track');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialsPrev = document.querySelector('.testimonials-prev');
const testimonialsNext = document.querySelector('.testimonials-next');
const testimonialsDots = document.querySelector('.testimonials-dots');

let currentTestimonial = 0;
let testimonialInterval;

// Criar dots
function createTestimonialDots() {
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonial-dot');
    dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    testimonialsDots.appendChild(dot);
  });
}

// Ir para depoimento específico
function goToTestimonial(index) {
  testimonialCards.forEach(card => card.classList.remove('active'));
  testimonialCards[index].classList.add('active');

  const dots = document.querySelectorAll('.testimonial-dot');
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');

  currentTestimonial = index;
}

// Próximo depoimento
function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  goToTestimonial(currentTestimonial);
}

// Depoimento anterior
function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  goToTestimonial(currentTestimonial);
}

// Autoplay
function startTestimonialAutoplay() {
  testimonialInterval = setInterval(nextTestimonial, 6000);
}

function stopTestimonialAutoplay() {
  clearInterval(testimonialInterval);
}

// Event listeners
if (testimonialsPrev) {
  testimonialsPrev.addEventListener('click', () => {
    prevTestimonial();
    stopTestimonialAutoplay();
    startTestimonialAutoplay();
  });
}

if (testimonialsNext) {
  testimonialsNext.addEventListener('click', () => {
    nextTestimonial();
    stopTestimonialAutoplay();
    startTestimonialAutoplay();
  });
}

// Pausar autoplay ao hover
if (testimonialsTrack) {
  testimonialsTrack.addEventListener('mouseenter', stopTestimonialAutoplay);
  testimonialsTrack.addEventListener('mouseleave', startTestimonialAutoplay);
}

// Inicializar
if (testimonialsDots && testimonialCards.length > 0) {
  createTestimonialDots();
  startTestimonialAutoplay();
}

/* ========================================
   6. ACCORDION FAQ
   ======================================== */

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const isExpanded = question.getAttribute('aria-expanded') === 'true';

    // Fechar todas as outras (opcional - remover para permitir múltiplas abertas)
    faqQuestions.forEach(q => {
      if (q !== question) {
        q.setAttribute('aria-expanded', 'false');
        q.parentElement.querySelector('.faq-answer').style.maxHeight = '0';
      }
    });

    // Toggle atual
    if (isExpanded) {
      question.setAttribute('aria-expanded', 'false');
      faqAnswer.style.maxHeight = '0';
    } else {
      question.setAttribute('aria-expanded', 'true');
      faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
    }
  });
});

/* ========================================
   7. VALIDAÇÃO DE FORMULÁRIO
   ======================================== */

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Máscara de telefone brasileiro
function maskPhone(value) {
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d)(\d{4})$/, '$1-$2');
  return value;
}

const phoneInput = document.getElementById('telefone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    e.target.value = maskPhone(e.target.value);
  });
}

// Validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de telefone brasileiro
function isValidPhone(phone) {
  const phoneDigits = phone.replace(/\D/g, '');
  return phoneDigits.length === 10 || phoneDigits.length === 11;
}

// Mostrar erro
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}Error`);
  if (input && errorSpan) {
    input.classList.add('error');
    errorSpan.textContent = message;
    errorSpan.classList.add('visible');
  }
}

// Limpar erro
function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}Error`);
  if (input && errorSpan) {
    input.classList.remove('error');
    errorSpan.textContent = '';
    errorSpan.classList.remove('visible');
  }
}

// Limpar todos os erros
function clearAllErrors() {
  const errorSpans = document.querySelectorAll('.form-error');
  errorSpans.forEach(span => {
    span.textContent = '';
    span.classList.remove('visible');
  });
  const errorInputs = document.querySelectorAll('.error');
  errorInputs.forEach(input => input.classList.remove('error'));
}

// Validar formulário
function validateForm(formData) {
  let isValid = true;
  clearAllErrors();

  // Nome
  if (!formData.get('nome') || formData.get('nome').trim().length < 3) {
    showError('nome', 'Por favor, insira seu nome completo (mínimo 3 caracteres).');
    isValid = false;
  }

  // Email
  if (!formData.get('email') || !isValidEmail(formData.get('email'))) {
    showError('email', 'Por favor, insira um e-mail válido.');
    isValid = false;
  }

  // Telefone
  if (!formData.get('telefone') || !isValidPhone(formData.get('telefone'))) {
    showError('telefone', 'Por favor, insira um telefone válido com DDD.');
    isValid = false;
  }

  // Forma de contato
  const contatoSelecionado = formData.get('contato');
  if (!contatoSelecionado) {
    const contatoError = document.getElementById('contatoError');
    if (contatoError) {
      contatoError.textContent = 'Por favor, selecione como prefere ser contatado.';
      contatoError.classList.add('visible');
    }
    isValid = false;
  }

  // Horário
  if (!formData.get('horario')) {
    showError('horario', 'Por favor, selecione o melhor horário.');
    isValid = false;
  }

  // Tratamento (pelo menos 1)
  const tratamentos = formData.getAll('tratamento');
  if (tratamentos.length === 0) {
    const tratamentoError = document.getElementById('tratamentoError');
    if (tratamentoError) {
      tratamentoError.textContent = 'Por favor, selecione pelo menos um tratamento de interesse.';
      tratamentoError.classList.add('visible');
    }
    isValid = false;
  }

  // Objetivos
  if (!formData.get('objetivos') || formData.get('objetivos').trim().length < 10) {
    showError('objetivos', 'Por favor, conte um pouco sobre seus objetivos (mínimo 10 caracteres).');
    isValid = false;
  }

  return isValid;
}

// Submit do formulário
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    if (!validateForm(formData)) {
      // Scroll para o primeiro erro
      const firstError = document.querySelector('.form-error.visible');
      if (firstError) {
        firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    submitBtn.disabled = true;

    // Simular envio (em produção real, enviaria para backend)
    setTimeout(() => {
      // Sucesso
      contactForm.style.display = 'none';
      successMessage.style.display = 'block';

      // Reset após 5 segundos (opcional)
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'flex';
        successMessage.style.display = 'none';
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
      }, 8000);

      // Log dados (em produção, enviaria para API)
      console.log('Formulário enviado com sucesso!');
      console.log('Dados:', Object.fromEntries(formData));
    }, 2000);
  });
}

/* ========================================
   8. BOTÃO VOLTAR AO TOPO
   ======================================== */

const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTopBtn() {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

window.addEventListener('scroll', toggleBackToTopBtn);

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', scrollToTop);
}

/* ========================================
   9. ANIMAÇÕES AO SCROLL (INTERSECTION OBSERVER)
   ======================================== */

const fadeInElements = document.querySelectorAll(
  '.specialty-card, .tech-card, .portfolio-card, .blog-card, .timeline-item, .journey-phase, .testimonial-card'
);

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in', 'visible');
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeInElements.forEach(element => {
  element.classList.add('fade-in');
  fadeInObserver.observe(element);
});

/* ========================================
   10. LAZY LOADING DE IMAGENS
   ======================================== */

const lazyImages = document.querySelectorAll('img[loading="lazy"]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.src; // Força o carregamento
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '50px'
});

lazyImages.forEach(img => {
  imageObserver.observe(img);
});

/* ========================================
   11. SCROLL REVEAL COM DELAY (STAGGER)
   ======================================== */

const staggerElements = document.querySelectorAll('.feature-item, .cert-item');

staggerElements.forEach((element, index) => {
  element.style.transitionDelay = `${index * 0.1}s`;
  element.classList.add('fade-in');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  staggerObserver.observe(element);
});

/* ========================================
   12. SMOOTH SCROLL PARA TODOS OS LINKS ÂNCORA
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Ignora links vazios ou apenas "#"
    if (href === '#' || href === '') {
      e.preventDefault();
      return;
    }

    const targetElement = document.querySelector(href);

    if (targetElement) {
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 80;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ========================================
   13. PERFORMANCE: DEBOUNCE PARA SCROLL
   ======================================== */

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Aplicar debounce em funções de scroll
const debouncedStickyHeader = debounce(handleStickyHeader, 10);
const debouncedActiveSection = debounce(updateActiveSection, 100);
const debouncedBackToTop = debounce(toggleBackToTopBtn, 10);

window.removeEventListener('scroll', handleStickyHeader);
window.removeEventListener('scroll', updateActiveSection);
window.removeEventListener('scroll', toggleBackToTopBtn);

window.addEventListener('scroll', debouncedStickyHeader);
window.addEventListener('scroll', debouncedActiveSection);
window.addEventListener('scroll', debouncedBackToTop);

/* ========================================
   14. INICIALIZAÇÃO
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🦷 Site Dra. Isabela Moreira carregado com sucesso!');
  console.log('✨ Desenvolvido por Hudson Oliveira | HO DEVWEB');

  // Executar funções iniciais
  handleStickyHeader();
  updateActiveSection();
  toggleBackToTopBtn();
});

/* ========================================
   15. SERVICE WORKER (OPCIONAL - PWA)
   ======================================== */

// Descomentar para habilitar PWA
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registrado:', registration))
      .catch(error => console.log('SW falhou:', error));
  });
}
*/
