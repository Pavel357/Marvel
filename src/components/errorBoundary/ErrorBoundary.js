import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage"; //1. Импортируем компонент с показом ошибки при отлове

class ErrorBoundary extends Component {
    state = {
        error: false //2. Устанавливаем состояние ошибки в false
    }

    componentDidCatch(error, errorInfo) { //3. Отслеживаем ошибку в дочернем компоненте
        console.log(error, errorInfo);

        this.setState({
            error: true
        })
    } 

    render() {
        if (this.state.error) {
            return <ErrorMessage /> //4. Если состояние ошибки true, то показываем ошибку
        }
    
        return this.props.children; //5. Отслеживаем дочерние компоненты
    }
}

export default ErrorBoundary;