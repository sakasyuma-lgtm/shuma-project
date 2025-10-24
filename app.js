// 図形の証明学習アプリ

class GeometryProofApp {
    constructor() {
        this.currentProblem = null;
        this.userProofSteps = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showTutorialMode(); // 最初は解説モードを表示
    }

    setupEventListeners() {
        // モード切り替え
        document.getElementById('tutorialModeBtn').addEventListener('click', () => this.showTutorialMode());
        document.getElementById('practiceModeBtn').addEventListener('click', () => this.showPracticeMode());
        document.getElementById('startPracticeBtn').addEventListener('click', () => this.showPracticeMode());

        // 練習モードのイベントリスナー
        document.getElementById('newProblemBtn').addEventListener('click', () => this.generateNewProblem());
        document.getElementById('addStepBtn').addEventListener('click', () => this.addProofStep());
        document.getElementById('checkAnswerBtn').addEventListener('click', () => this.checkAnswer());
        document.getElementById('showHintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('showAnswerBtn').addEventListener('click', () => this.showAnswer());
        document.getElementById('clearProofBtn').addEventListener('click', () => this.clearProof());

        // Enterキーでステップを追加
        document.getElementById('stepContent').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProofStep();
            }
        });
    }

    showTutorialMode() {
        document.getElementById('tutorialMode').classList.remove('hidden');
        document.getElementById('practiceMode').classList.add('hidden');
        document.getElementById('tutorialModeBtn').classList.add('active');
        document.getElementById('practiceModeBtn').classList.remove('active');
    }

    showPracticeMode() {
        document.getElementById('tutorialMode').classList.add('hidden');
        document.getElementById('practiceMode').classList.remove('hidden');
        document.getElementById('tutorialModeBtn').classList.remove('active');
        document.getElementById('practiceModeBtn').classList.add('active');

        // 練習モードに切り替えた時に問題を生成
        if (!this.currentProblem) {
            this.generateNewProblem();
        }
    }

    generateNewProblem() {
        const problemTypes = [
            this.generateTriangleCongruenceProblem.bind(this),
            this.generateIsoscelesTriangleProblem.bind(this),
            this.generateParallelLinesProblem.bind(this),
            this.generateVerticalAnglesProblem.bind(this)
        ];

        const randomType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        this.currentProblem = randomType();

        this.renderProblem();
        this.clearProof();
        this.hideFeedback();
        this.hideAnswer();
    }

    generateTriangleCongruenceProblem() {
        const types = ['SAS', 'ASA', 'SSS'];
        const type = types[Math.floor(Math.random() * types.length)];

        const problem = {
            type: 'triangleCongruence',
            congruenceType: type,
            title: '三角形の合同の証明',
            geometry: this.createTriangleCongruenceGeometry(type),
            conditions: [],
            goal: '△ABC ≡ △DEF',
            solution: []
        };

        switch (type) {
            case 'SAS':
                problem.conditions = [
                    'AB = DE',
                    '∠ABC = ∠DEF',
                    'BC = EF'
                ];
                problem.solution = [
                    { step: 'AB = DE', reason: '仮定より' },
                    { step: '∠ABC = ∠DEF', reason: '仮定より' },
                    { step: 'BC = EF', reason: '仮定より' },
                    { step: '△ABC ≡ △DEF', reason: '2辺とその間の角が等しいから（SAS）' }
                ];
                break;
            case 'ASA':
                problem.conditions = [
                    '∠ABC = ∠DEF',
                    'BC = EF',
                    '∠BCA = ∠EFD'
                ];
                problem.solution = [
                    { step: '∠ABC = ∠DEF', reason: '仮定より' },
                    { step: 'BC = EF', reason: '仮定より' },
                    { step: '∠BCA = ∠EFD', reason: '仮定より' },
                    { step: '△ABC ≡ △DEF', reason: '1辺とその両端の角が等しいから（ASA）' }
                ];
                break;
            case 'SSS':
                problem.conditions = [
                    'AB = DE',
                    'BC = EF',
                    'CA = FD'
                ];
                problem.solution = [
                    { step: 'AB = DE', reason: '仮定より' },
                    { step: 'BC = EF', reason: '仮定より' },
                    { step: 'CA = FD', reason: '仮定より' },
                    { step: '△ABC ≡ △DEF', reason: '3辺が等しいから（SSS）' }
                ];
                break;
        }

        return problem;
    }

    generateIsoscelesTriangleProblem() {
        const problem = {
            type: 'isosceles',
            title: '二等辺三角形の性質',
            geometry: this.createIsoscelesTriangleGeometry(),
            conditions: [
                'AB = AC',
                '点Dは辺BCの中点'
            ],
            goal: '△ABD ≡ △ACD',
            solution: [
                { step: 'AB = AC', reason: '仮定より' },
                { step: 'BD = CD', reason: 'Dは辺BCの中点より' },
                { step: 'AD = AD', reason: '共通な辺' },
                { step: '△ABD ≡ △ACD', reason: '3辺が等しいから（SSS）' }
            ]
        };

        return problem;
    }

    generateParallelLinesProblem() {
        const problem = {
            type: 'parallel',
            title: '平行線と角',
            geometry: this.createParallelLinesGeometry(),
            conditions: [
                'AB // CD',
                'AD = BC'
            ],
            goal: '△ABD ≡ △DCB',
            solution: [
                { step: 'AB // CD', reason: '仮定より' },
                { step: '∠ABD = ∠CDB', reason: '平行線の錯角は等しい' },
                { step: 'AD = BC', reason: '仮定より' },
                { step: 'BD = BD', reason: '共通な辺' },
                { step: '△ABD ≡ △DCB', reason: '2辺とその間の角が等しいから（SAS）' }
            ]
        };

        return problem;
    }

    generateVerticalAnglesProblem() {
        const problem = {
            type: 'vertical',
            title: '対頂角の性質',
            geometry: this.createVerticalAnglesGeometry(),
            conditions: [
                '2つの直線ABとCDが点Oで交わる',
                'AO = BO',
                'CO = DO'
            ],
            goal: '△AOC ≡ △BOD',
            solution: [
                { step: 'AO = BO', reason: '仮定より' },
                { step: '∠AOC = ∠BOD', reason: '対頂角は等しい' },
                { step: 'CO = DO', reason: '仮定より' },
                { step: '△AOC ≡ △BOD', reason: '2辺とその間の角が等しいから（SAS）' }
            ]
        };

        return problem;
    }

    createTriangleCongruenceGeometry(type) {
        return {
            shapes: [
                {
                    type: 'triangle',
                    points: [[50, 250], [200, 100], [200, 250]],
                    labels: ['A', 'B', 'C'],
                    marks: type === 'SAS' ?
                        { sides: [[0, 1], [1, 2]], angles: [1] } :
                        type === 'ASA' ?
                        { sides: [[1, 2]], angles: [1, 2] } :
                        { sides: [[0, 1], [1, 2], [2, 0]] }
                },
                {
                    type: 'triangle',
                    points: [[300, 250], [450, 100], [450, 250]],
                    labels: ['D', 'E', 'F'],
                    marks: type === 'SAS' ?
                        { sides: [[0, 1], [1, 2]], angles: [1] } :
                        type === 'ASA' ?
                        { sides: [[1, 2]], angles: [1, 2] } :
                        { sides: [[0, 1], [1, 2], [2, 0]] }
                }
            ]
        };
    }

    createIsoscelesTriangleGeometry() {
        return {
            shapes: [
                {
                    type: 'triangle',
                    points: [[150, 300], [250, 80], [350, 300]],
                    labels: ['B', 'A', 'C'],
                    marks: { sides: [[1, 0], [1, 2]] }
                },
                {
                    type: 'point',
                    point: [250, 300],
                    label: 'D'
                },
                {
                    type: 'line',
                    points: [[250, 80], [250, 300]]
                }
            ]
        };
    }

    createParallelLinesGeometry() {
        return {
            shapes: [
                {
                    type: 'quadrilateral',
                    points: [[100, 150], [400, 150], [350, 300], [150, 300]],
                    labels: ['A', 'B', 'C', 'D'],
                    marks: { parallel: [[0, 1], [3, 2]], sides: [[0, 3], [1, 2]] }
                },
                {
                    type: 'line',
                    points: [[100, 150], [350, 300]],
                    isDiagonal: true
                }
            ]
        };
    }

    createVerticalAnglesGeometry() {
        return {
            shapes: [
                {
                    type: 'lines',
                    lines: [
                        [[50, 250], [450, 250]],
                        [[250, 100], [250, 350]]
                    ],
                    labels: ['A', 'B', 'C', 'D', 'O'],
                    labelPositions: [[30, 240], [470, 240], [260, 80], [260, 370], [220, 240]],
                    marks: { sides: [[0, 4], [4, 1]] }
                }
            ]
        };
    }

    renderProblem() {
        // タイトルと条件を表示
        const conditionsList = document.getElementById('conditions');
        conditionsList.innerHTML = '';
        this.currentProblem.conditions.forEach(condition => {
            const li = document.createElement('li');
            li.textContent = condition;
            conditionsList.appendChild(li);
        });

        document.getElementById('goalStatement').textContent = this.currentProblem.goal;

        // SVGで図形を描画
        this.drawGeometry();
    }

    drawGeometry() {
        const svg = document.getElementById('geometrySvg');
        svg.innerHTML = '';

        const geometry = this.currentProblem.geometry;

        geometry.shapes.forEach(shape => {
            if (shape.type === 'triangle') {
                this.drawTriangle(svg, shape);
            } else if (shape.type === 'quadrilateral') {
                this.drawQuadrilateral(svg, shape);
            } else if (shape.type === 'point') {
                this.drawPoint(svg, shape.point, shape.label);
            } else if (shape.type === 'line') {
                this.drawLine(svg, shape.points[0], shape.points[1], shape.isDiagonal);
            } else if (shape.type === 'lines') {
                this.drawIntersectingLines(svg, shape);
            }
        });
    }

    drawTriangle(svg, triangle) {
        const points = triangle.points;

        // 辺を描画
        for (let i = 0; i < 3; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % 3];
            this.drawLine(svg, p1, p2);

            // 等しい辺のマーク
            if (triangle.marks && triangle.marks.sides) {
                triangle.marks.sides.forEach((sidePair, idx) => {
                    if (sidePair[0] === i && sidePair[1] === (i + 1) % 3) {
                        this.drawEqualMark(svg, p1, p2, idx + 1);
                    }
                });
            }
        }

        // 頂点のラベル
        points.forEach((point, i) => {
            this.drawPoint(svg, point);
            this.drawLabel(svg, point, triangle.labels[i]);
        });

        // 角度のマーク
        if (triangle.marks && triangle.marks.angles) {
            triangle.marks.angles.forEach(angleIdx => {
                this.drawAngleMark(svg, points, angleIdx);
            });
        }
    }

    drawQuadrilateral(svg, quad) {
        const points = quad.points;

        // 辺を描画
        for (let i = 0; i < 4; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % 4];
            this.drawLine(svg, p1, p2);

            // 等しい辺のマーク
            if (quad.marks && quad.marks.sides) {
                quad.marks.sides.forEach((sidePair, idx) => {
                    if ((sidePair[0] === i && sidePair[1] === (i + 1) % 4) ||
                        (sidePair[1] === i && sidePair[0] === (i + 1) % 4)) {
                        this.drawEqualMark(svg, p1, p2, 1);
                    }
                });
            }

            // 平行線のマーク
            if (quad.marks && quad.marks.parallel) {
                quad.marks.parallel.forEach(parallelPair => {
                    if ((parallelPair[0] === i && parallelPair[1] === (i + 1) % 4) ||
                        (parallelPair[1] === i && parallelPair[0] === (i + 1) % 4)) {
                        this.drawParallelMark(svg, p1, p2);
                    }
                });
            }
        }

        // 頂点のラベル
        points.forEach((point, i) => {
            this.drawPoint(svg, point);
            this.drawLabel(svg, point, quad.labels[i]);
        });
    }

    drawIntersectingLines(svg, shape) {
        shape.lines.forEach(line => {
            this.drawLine(svg, line[0], line[1]);
        });

        shape.labelPositions.forEach((pos, i) => {
            if (i < shape.labelPositions.length - 1 || shape.labels[i]) {
                const pointPos = i === 4 ? [250, 250] :
                    i === 0 ? [50, 250] :
                    i === 1 ? [450, 250] :
                    i === 2 ? [250, 100] : [250, 350];
                this.drawPoint(svg, pointPos);
                this.drawLabel(svg, pos, shape.labels[i]);
            }
        });

        // 等しい辺のマーク
        if (shape.marks && shape.marks.sides) {
            const center = [250, 250];
            shape.marks.sides.forEach((sidePair, idx) => {
                const p1 = sidePair[0] === 0 ? [50, 250] : center;
                const p2 = sidePair[1] === 1 ? [450, 250] : center;
                this.drawEqualMark(svg, p1, p2, 1);
            });
        }
    }

    drawLine(svg, p1, p2, isDashed = false) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', p1[0]);
        line.setAttribute('y1', p1[1]);
        line.setAttribute('x2', p2[0]);
        line.setAttribute('y2', p2[1]);
        line.setAttribute('class', 'svg-line');
        if (isDashed) {
            line.setAttribute('stroke-dasharray', '5,5');
        }
        svg.appendChild(line);
    }

    drawPoint(svg, point, label = null) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point[0]);
        circle.setAttribute('cy', point[1]);
        circle.setAttribute('r', 4);
        circle.setAttribute('class', 'svg-point');
        svg.appendChild(circle);
    }

    drawLabel(svg, point, text) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', point[0]);
        label.setAttribute('y', point[1]);
        label.setAttribute('class', 'svg-label');
        label.textContent = text;
        svg.appendChild(label);
    }

    drawEqualMark(svg, p1, p2, count) {
        const mx = (p1[0] + p2[0]) / 2;
        const my = (p1[1] + p2[1]) / 2;
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len * 5;
        const ny = dx / len * 5;

        for (let i = 0; i < count; i++) {
            const offset = (i - (count - 1) / 2) * 8;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', mx + nx + offset * dx / len);
            line.setAttribute('y1', my + ny + offset * dy / len);
            line.setAttribute('x2', mx - nx + offset * dx / len);
            line.setAttribute('y2', my - ny + offset * dy / len);
            line.setAttribute('class', 'svg-equal-mark');
            svg.appendChild(line);
        }
    }

    drawParallelMark(svg, p1, p2) {
        const mx = (p1[0] + p2[0]) / 2;
        const my = (p1[1] + p2[1]) / 2;
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        const len = Math.sqrt(dx * dx + dy * dy);

        const arrowSize = 10;
        const angle = Math.atan2(dy, dx);

        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${mx - arrowSize} ${my - 5} L ${mx + arrowSize} ${my - 5}
                   M ${mx - arrowSize} ${my + 5} L ${mx + arrowSize} ${my + 5}`;
        arrow.setAttribute('d', d);
        arrow.setAttribute('class', 'svg-parallel-mark');
        arrow.setAttribute('fill', 'none');
        svg.appendChild(arrow);
    }

    drawAngleMark(svg, points, angleIdx) {
        const p1 = points[(angleIdx - 1 + 3) % 3];
        const center = points[angleIdx];
        const p2 = points[(angleIdx + 1) % 3];

        const angle1 = Math.atan2(p1[1] - center[1], p1[0] - center[0]);
        const angle2 = Math.atan2(p2[1] - center[1], p2[0] - center[0]);

        const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const radius = 20;
        const x1 = center[0] + radius * Math.cos(angle1);
        const y1 = center[1] + radius * Math.sin(angle1);
        const x2 = center[0] + radius * Math.cos(angle2);
        const y2 = center[1] + radius * Math.sin(angle2);

        const d = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
        arc.setAttribute('d', d);
        arc.setAttribute('class', 'svg-angle-mark');
        svg.appendChild(arc);
    }

    addProofStep() {
        const reasonType = document.getElementById('reasonType').value;
        const stepContent = document.getElementById('stepContent').value.trim();

        if (!reasonType || !stepContent) {
            this.showFeedback('理由と内容の両方を入力してください。', 'error');
            return;
        }

        const reasonTexts = {
            'given': '仮定より',
            'vertical': '対頂角は等しい',
            'common': '共通な辺',
            'parallel': '平行線の錯角は等しい',
            'parallel-alt': '平行線の同位角は等しい',
            'isosceles': '二等辺三角形の底角は等しい',
            'congruent-sas': '2辺とその間の角が等しいから（SAS）',
            'congruent-asa': '1辺とその両端の角が等しいから（ASA）',
            'congruent-sss': '3辺が等しいから（SSS）',
            'cpctc': '合同な図形の対応する辺（角）は等しい'
        };

        this.userProofSteps.push({
            step: stepContent,
            reason: reasonTexts[reasonType]
        });

        this.renderProofSteps();

        // フォームをクリア
        document.getElementById('reasonType').value = '';
        document.getElementById('stepContent').value = '';
        this.hideFeedback();
    }

    renderProofSteps() {
        const container = document.getElementById('proofSteps');
        container.innerHTML = '';

        this.userProofSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'proof-step';
            stepDiv.innerHTML = `
                <div class="proof-step-content">
                    <div class="proof-step-number">ステップ ${index + 1}</div>
                    <div class="proof-step-text">${step.step}</div>
                    <div class="proof-step-reason">理由: ${step.reason}</div>
                </div>
                <button class="proof-step-delete" data-index="${index}">削除</button>
            `;

            stepDiv.querySelector('.proof-step-delete').addEventListener('click', (e) => {
                this.deleteProofStep(parseInt(e.target.dataset.index));
            });

            container.appendChild(stepDiv);
        });
    }

    deleteProofStep(index) {
        this.userProofSteps.splice(index, 1);
        this.renderProofSteps();
    }

    clearProof() {
        this.userProofSteps = [];
        this.renderProofSteps();
        this.hideFeedback();
        this.hideAnswer();
    }

    checkAnswer() {
        if (this.userProofSteps.length === 0) {
            this.showFeedback('証明のステップを入力してください。', 'error');
            return;
        }

        const solution = this.currentProblem.solution;

        // 完全一致チェック
        if (this.userProofSteps.length !== solution.length) {
            this.showFeedback(
                `ステップ数が違います。必要なステップ数: ${solution.length}、あなたのステップ数: ${this.userProofSteps.length}`,
                'error'
            );
            return;
        }

        // 各ステップの内容チェック（簡易版）
        let isCorrect = true;
        for (let i = 0; i < solution.length; i++) {
            const userStep = this.userProofSteps[i].step.replace(/\s/g, '');
            const solutionStep = solution[i].step.replace(/\s/g, '');

            if (userStep !== solutionStep) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            this.showFeedback('正解です！よくできました！', 'success');
        } else {
            this.showFeedback('惜しい！もう一度確認してみましょう。ヒントボタンを押すと、次のステップのヒントが見られます。', 'error');
        }
    }

    showHint() {
        const solution = this.currentProblem.solution;
        const nextStepIndex = this.userProofSteps.length;

        if (nextStepIndex >= solution.length) {
            this.showFeedback('すべてのステップが入力されています。答え合わせボタンで確認してください。', 'info');
            return;
        }

        const nextStep = solution[nextStepIndex];
        this.showFeedback(
            `ヒント（ステップ ${nextStepIndex + 1}）: 理由は「${nextStep.reason}」です。`,
            'info'
        );
    }

    showAnswer() {
        const answerSection = document.getElementById('answerSection');
        const modelAnswer = document.getElementById('modelAnswer');

        modelAnswer.innerHTML = '';

        this.currentProblem.solution.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'model-answer-step';
            stepDiv.innerHTML = `
                <div class="proof-step-number">ステップ ${index + 1}</div>
                <div class="proof-step-text">${step.step}</div>
                <div class="proof-step-reason">理由: ${step.reason}</div>
            `;
            modelAnswer.appendChild(stepDiv);
        });

        answerSection.classList.remove('hidden');
    }

    hideAnswer() {
        document.getElementById('answerSection').classList.add('hidden');
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        feedback.classList.remove('hidden');
    }

    hideFeedback() {
        document.getElementById('feedback').classList.add('hidden');
    }
}

// アプリを初期化
document.addEventListener('DOMContentLoaded', () => {
    new GeometryProofApp();
});
