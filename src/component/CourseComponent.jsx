import React, {Component} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CourseDataService from '../service/CourseDataService';
const INSTRUCTOR = 'in28minutes';

class CourseComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            description: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this)
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = 'Enter a Description'
        } else if (values.description.length < 5) {
            errors.description = 'Enter atleast 5 Characters in Description'
        }
        return errors
    }    

    onSubmit(values) {
        let username = INSTRUCTOR
        let course = {
            id: this.state.id,
            description: values.description,
            targetDate: values.targetDate
        }
        if (this.state.id === -1) {
            CourseDataService.createCourse(username, course)
                .then(() => this.props.history.push('/courses'))
        } else {
            CourseDataService.updateCourse(username, this.state.id, course)
                .then(() => this.props.history.push('/courses'))
        }
        console.log(values);
    }    

    componentDidMount() {
        console.log(this.state.id)
        // eslint-disable-next-line
        if (this.state.id == -1) {
            return;
        }
        CourseDataService.retrieveCourse(INSTRUCTOR, this.state.id)
            .then(response => this.setState({
                description: response.data.description
            }));
    }
    render() {
        let { description, id } = this.state;
        return (
            <div>
                <h3>Course</h3>
                <div className="container">
                    <Formik initialValues={{id:id, description:description}} 
                        onSubmit={this.onSubmit}
                        validateOnChange={false} 
	                    validateOnBlur={false} 
	                    validate={this.validate} 
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <fieldset className="form-group">
                                        <label>Id</label>
                                        <Field className="form-control" type="text" name="id" disabled />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="description" />
                                    </fieldset>
                                    <ErrorMessage name="description" component="div" className="alert alert-warning" />
                                    <button className="btn btn-success" type="submit">Save</button>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        )
    }

}
export default CourseComponent;
