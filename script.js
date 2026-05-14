async function hirekBetoltese() {
    const container = document.getElementById('hirek-lista');
    const heroContainer = document.getElementById('hero-hir');
    if (!container) return;

    try {
        const response = await fetch('hirek.json');
        const hirek = await response.json();
        const rendezettHirek = [...hirek].reverse();
        const isFooldal = document.body.classList.contains('fooldal-body');

        if (isFooldal) {
            // --- FŐOLDAL LOGIKA ---
            const kiemeltHirek = rendezettHirek.filter(h => h.kiemelt);

            // 1. Hero hír betöltése (ha van kiemelt)
            if (heroContainer && kiemeltHirek.length > 0) {
                const hero = kiemeltHirek[0];
                heroContainer.innerHTML = `
                    <div class="row align-items-center g-4" onclick="cikkMegnyitasa(${hero.id})" style="cursor:pointer;">
                        <div class="col-lg-8">
                            <div class="kep-tarolo shadow-sm">
                                <img src="${hero.kep}" style="width:100%; aspect-ratio:16/9; object-fit:cover;">
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <span class="re" style="font-size: 1.2rem;">KIEMELT</span>
                            <h1 style="font-family: 'serif'; font-weight: 900; font-size: 2.5rem; line-height:1.1;">${hero.cim}</h1>
                            <p class="lead text-muted">${hero.alcim}</p>
                            <div class="datum">${hero.datum}</div>
                        </div>
                    </div>
                `;
            }

            // 2. Többi kiemelt rácsba (a 2. hírtől kezdve)
            container.innerHTML = '';
            kiemeltHirek.slice(1).forEach(hir => {
                container.innerHTML += `
                    <div class="col-md-6 mb-4" onclick="cikkMegnyitasa(${hir.id})" style="cursor:pointer;">
                        <div class="border-bottom pb-3 h-100">
                            <img src="${hir.kep}" class="img-fluid mb-3" style="aspect-ratio:16/9; object-fit:cover; width:100%;">
                            <h3 style="font-family: 'serif'; font-weight: 700;">${hir.cim}</h3>
                            <p class="text-muted small">${hir.alcim}</p>
                            <div class="datum" style="font-size: 0.8rem; color: #888;">${hir.datum}</div>
                            </div>
                        </div>
                    </div>
                `;
            });

        } else {
            // --- HÍREK OLDAL LOGIKA (A kétvonalas Mandiner-stílus) ---
            container.innerHTML = '';
            rendezettHirek.forEach(hir => {
                container.innerHTML += `
                    <div class="hír-konténer mx-auto" onclick="cikkMegnyitasa(${hir.id})">
                        <div class="row g-0 align-items-center">
                            <div class="col-md-4">
                                <div class="kep-tarolo">
                                    <img src="${hir.kep}" alt="Hír">
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="kartya">
                                    <div class="re">Re:akció</div>
                                    <h2 class="cim">${hir.cim}</h2>
                                    <p class="alcim">${hir.alcim}</p>
                                    <div class="datum">${hir.datum}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (e) {
        console.error("Hiba történt:", e);
    }
}

// CIKK BETÖLTÉSE (Változatlan)
async function cikkReszletekBetoltese() {
    const container = document.getElementById('cikk-betoltes');
    if (!container) return;

    const id = localStorage.getItem('aktualisHirID');
    const response = await fetch('hirek.json');
    const hirek = await response.json();
    const hir = hirek.find(h => h.id == id);

    if (hir) {
        document.title = hir.cim + " | RE:AKCIÓ";
        container.innerHTML = `
            <div class="mb-4">
                <span class="re" style="font-size: 1rem;">Re:akció</span>
                <h1 class="display-4 fw-bold mb-3" style="font-family: 'serif';">${hir.cim}</h1>
                <p class="lead text-muted mb-4">${hir.alcim}</p>
                <div class="datum mb-4">${hir.datum}</div>
                <img src="${hir.kep}" class="img-fluid w-100 mb-5" style="aspect-ratio: 16/9; object-fit: cover;">
            </div>
            <div class="cikk-szoveg" style="font-size: 1.1rem; line-height: 1.8;">
                ${hir.tartalom}
            </div>
        `;
    }
}

function cikkMegnyitasa(id) {
    localStorage.setItem('aktualisHirID', id);
    window.location.href = 'cikk.html';
}

document.addEventListener('DOMContentLoaded', () => {
    hirekBetoltese();
    cikkReszletekBetoltese();
});