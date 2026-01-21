import { createClient } from '@supabase/supabase-js';

// 1. Backend Initialization [5]
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

const GENERATOR = {
    // Logic Frames ( dna for the autonomous engine )
    frames: {
        ORGANIC: (cfg) => {
            const isHBr = Math.random() > 0.5;
            const s = cfg.substrates[Math.floor(Math.random() * cfg.substrates.length)];
            return {
                id: `ORG_${Date.now()}`,
                question: `Reaction: $${s.formula}$ with $${isHBr? 'HBr' : 'HCl'}$ + **Peroxide**.`,
                up: `${isHBr? '2-Bromopropane' : '1-Chloropropane'} (Trap)`,
                left: "1,2-Dihaloalkane (Misfit)",
                right: `${isHBr? '1-Bromopropane' : '2-Chloropropane'} (Solution)`,
                map: isHBr? "Peroxide effect only works with HBr (Radical)." : "HCl stays Markovnikov."
            };
        }
    }
};

const APP = {
    deck:,
    idx: 0,
    answers:,
    currentMode: 'FULL_TEST',

    async init() {
        // Fetch Logic Frames from Supabase
        const { data } = await supabase.from('question_templates').select('*');
        this.config = data;
        this.showView('view-start');
    },

    start(topicKey) {
        this.currentMode = topicKey;
        this.deck =;
        // Generate 15 non-repetitive questions on the fly [turn 19]
        for(let i=0; i<15; i++) {
            const frameCfg = this.config.find(f => f.topic === topicKey) |

| this.config;
            this.deck.push(GENERATOR.frames[topicKey](frameCfg.config));
        }
        this.idx = 0;
        this.answers =;
        this.showView('view-game');
        this.render();
    },

    // 3D Swipe Physics Logic [8, 6, 9]
    handleSwipe(dir) {
        const currentQ = this.deck[this.idx];
        const startTime = this.lastRenderTime;
        
        this.answers.push({
            id: currentQ.id,
            choice: dir,
            latency: Date.now() - startTime,
            isCorrect: dir === 'RIGHT'
        });

        if (dir === 'DOWN') {
            this.triggerLogicPivot(currentQ.map);
        } else {
            this.idx++;
            this.idx < this.deck.length? this.render() : this.complete();
        }
    },

    async submitScore() {
        const studentName = document.getElementById('student-name').value;
        if (!studentName) return alert("Enter name!");

        // Sync to Supabase Audit/LOGS table
        const { error } = await supabase.from('user_progress').insert(
            this.answers.map(ans => ({
                student_name: studentName,
                question_id: ans.id,
                latency: ans.latency,
                choice: ans.choice
            }))
        );
        
        if (!error) document.getElementById('name-zone').innerText = "Rank Updated ✓";
    },

    startReview() {
        // Targeted Review: Only concepts user failed [turn 30]
        const failures = this.answers.filter(a =>!a.isCorrect).map(a => a.id);
        if (failures.length === 0) return alert("Nothing to review!");
        
        this.deck = this.deck.filter(q => failures.includes(q.id));
        this.idx = 0;
        this.answers =;
        this.showView('view-game');
        this.render();
    }
};

// UI Router
APP.showView = (id) => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};
