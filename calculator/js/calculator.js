class Calculator {
    constructor() {
        this.displayElement = document.getElementById('display');
        this.reset();
    }

    // 계산기 상태 초기화
    reset() {
        this.display = '0';
        this.previous = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    // 디스플레이 업데이트
    updateDisplay() {
        this.displayElement.value = this.display;
    }

    // 숫자 입력
    input(num) {
        // 다음 숫자 입력이 디스플레이를 초기화해야 하는 경우
        if (this.shouldResetDisplay) {
            this.display = num;
            this.shouldResetDisplay = false;
        } else {
            // 0이 아닐 때만 숫자 추가 (또는 이미 0이 아닌 경우)
            if (this.display === '0') {
                this.display = num;
            } else {
                this.display += num;
            }
        }
        this.updateDisplay();
    }

    // 소수점 입력
    decimal() {
        if (this.shouldResetDisplay) {
            this.display = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.display.includes('.')) {
            this.display += '.';
        }
        this.updateDisplay();
    }

    // 연산자 입력
    operate(nextOp) {
        const currentValue = parseFloat(this.display);

        // 이전에 연산자가 있었고 새 연산자를 입력한 경우
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.display = String(this.performOperation(this.previous, currentValue, this.operation));
        }

        this.previous = this.display;
        this.operation = nextOp;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    // 두 수의 연산 수행
    performOperation(prev, current, op) {
        prev = parseFloat(prev);

        switch (op) {
            case '+':
                return prev + current;
            case '-':
                return prev - current;
            case '*':
                return prev * current;
            case '/':
                // 0으로 나누기 방지
                if (current === 0) {
                    alert('0으로 나눌 수 없습니다.');
                    return prev;
                }
                return prev / current;
            default:
                return current;
        }
    }

    // 계산 실행
    calculate() {
        if (this.operation === null || this.shouldResetDisplay) {
            return;
        }

        const currentValue = parseFloat(this.display);
        const result = this.performOperation(this.previous, currentValue, this.operation);

        this.display = String(result);
        this.operation = null;
        this.previous = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    // 초기화
    clear() {
        this.reset();
    }

    // 마지막 자리 삭제
    delete() {
        if (this.display.length === 1) {
            this.display = '0';
        } else {
            this.display = this.display.slice(0, -1);
        }
        this.updateDisplay();
    }
}

// 전역 app 인스턴스 생성
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new Calculator();
});
