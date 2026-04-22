import re

bracket_html = '''                <div class="bracket-container">
                    <!-- OCTAVOS -->
                    <div class="bracket-col space-y-4">
                        <div class="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Octavos
                        </div>'''

for i in range(1, 9):
    date = f"{(27+i//3) if (27+i//3) <=30 else (i//3 - 3):02d} {'Jun' if (27+i//3) <= 30 else 'Jul'}"
    time = "16:00" if i % 2 != 0 else "20:00"
    bracket_html += f'''
                        <!-- Match {i} -->
                        <div class="bracket-match has-connector hover-lift border-dashed border-slate-600 bg-transparent">
                            <div class="text-[10px] text-center text-slate-500 py-1 border-b border-slate-700/50 bg-slate-800/30">
                                Por definir</div>
                            <div class="bracket-team text-slate-500">
                                <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                <span class="bracket-score bg-slate-800/50">-</span>
                            </div>
                            <div class="bracket-team border-t border-slate-700/50 text-slate-500">
                                <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                <span class="bracket-score bg-slate-800/50">-</span>
                            </div>
                        </div>'''

bracket_html += '''
                    </div>

                    <!-- CUARTOS -->
                    <div class="bracket-col">
                        <div class="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Cuartos
                        </div>
                        <div class="flex-1 flex flex-col justify-around py-12 space-y-12">'''

for i in range(4):
    if i == 2:
        bracket_html += '''                            <div class="h-10"></div> <!-- Alineación con bloque inferior de octavos -->\n'''
    bracket_html += '''
                            <div class="bracket-match has-connector hover-lift border-dashed border-slate-600 bg-transparent">
                                <div class="bracket-team text-slate-500">
                                    <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                </div>
                                <div class="bracket-team border-t border-slate-700/50 text-slate-500">
                                    <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                </div>
                            </div>'''

bracket_html += '''
                        </div>
                    </div>

                    <!-- SEMIFINALES -->
                    <div class="bracket-col">
                        <div class="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">
                            Semifinales
                        </div>
                        <div class="flex-1 flex flex-col justify-around py-32 space-y-32">'''

for i in range(2):
    if i == 1:
        bracket_html += '''                            <div class="h-10"></div>\n'''
    bracket_html += '''
                            <div class="bracket-match has-connector hover-lift border-dashed border-slate-600 bg-transparent">
                                <div class="bracket-team text-slate-500">
                                    <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                </div>
                                <div class="bracket-team border-t border-slate-700/50 text-slate-500">
                                    <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                </div>
                            </div>'''

bracket_html += '''
                        </div>
                    </div>

                    <!-- FINAL -->
                    <div class="bracket-col">
                        <div class="text-center text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">Gran
                            Final
                        </div>
                        <div class="flex-1 flex flex-col justify-center">
                            <div class="bracket-match hover-lift border-brand-gold/50 shadow-[0_0_30px_rgba(251,191,36,0.15)] relative transform scale-110 ml-4">
                                <div class="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-brand-gold to-orange-500 rounded-full flex items-center justify-center shadow-lg text-white text-xl border-2 border-brand-darker z-10">
                                    🏆</div>
                                <div class="text-[10px] text-center text-brand-gold py-1.5 border-b border-brand-gold/20 bg-brand-gold/10 font-bold tracking-widest">
                                    Por definir</div>
                                <div class="bracket-team text-slate-400 py-3">
                                    <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                </div>
                                <div class="bracket-team border-t border-slate-700/50 text-slate-400 py-3">
                                    <span class="flex items-center"><span class="mr-2 text-xl grayscale opacity-50">🏳️</span> Por definir</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>'''

with open('porra_mundial_2026.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'                <div class="bracket-container">.*?</div>\n            </div>\n    </section>'
new_content = re.sub(pattern, bracket_html + '\n            </div>\n    </section>', content, flags=re.DOTALL)

with open('porra_mundial_2026.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success')
