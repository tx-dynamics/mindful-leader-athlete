import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Notice } from "../../_metronic/_partials/controls";
import CompanyService from "../services/CompanyService";

function CreateCompany(props) {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");

  const [formValues, setFormValues] = useState([{ pod: "" }]);

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { pod: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await CompanyService.createCompany({
        companyName,
        companyDomain,
        departments: formValues,
      });

      console.log("Success", res);
      setCompanyName("");
      setCompanyDomain("");
      setFormValues([{ pod: "" }]);
      props.history.push("/companies");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <>
      <Card className="card card-custom gutter-b example example-compact">
        <Card.Header>
          <Card.Title>
            <h3 className="card-label">Create New Company</h3>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <div className="row">
              <div className="col-md-10">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label> Company Name</Form.Label>
                  <Form.Control
                    value={companyName}
                    placeholder="Dell"
                    onChange={(e) => setCompanyName(e.target.value)}
                    type="companyName"
                  />
                </Form.Group>
              </div>
              <div className="col-md-10">
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Company Domain</Form.Label>
                  <Form.Control
                    value={companyDomain}
                    placeholder="Enter domain e.g.domain.com"
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    type="companyDomain"
                  />
                </Form.Group>
              </div>
            </div>

            {/* <div className="col-md-12"> */}
            {formValues.map((element, index) => (
              <div key={index}>
                <hr className="my-3" />
                <div className="row">
                  <div className="col-md-10">
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label> POD {index + 1}</Form.Label>
                      <Form.Control
                        name="pod"
                        placeholder="POD Name"
                        value={element.pod || ""}
                        onChange={(e) => handleChange(index, e)}
                        type="text"
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-2">
                    {index ? (
                      <Button
                        variant="danger"
                        onClick={() => removeFormFields(index)}
                        style={{ marginTop: "1.8rem" }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            <div className="col-md-10">
              <Button
                variant="success"
                size="lg"
                block
                onClick={() => addFormFields()}
                style={{ marginBottom: "2rem" }}
              >
                Add POD
              </Button>
            </div>
            {/* </div> */}

            <div className="col-md-10">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                block
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default CreateCompany;
