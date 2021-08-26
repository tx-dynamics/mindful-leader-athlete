import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CompanyService from "../services/CompanyService";
import moment from "moment";
import queryString from "query-string";

function EditCompany(props) {
  const params = useParams();

  console.log("Props: ", params.id, props);
  //   const query = queryString.parse(props.location.search);
  //   console.log("query: ", query);
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [formValues, setFormValues] = useState([{ pod: "" }]);

  useEffect(() => {
    CompanyService.getSingleCompany(params.id).then((res) => {
      console.log("RES:", res);
      setCompanyName(res.companyName);
      setCompanyDomain(res.companyDomain);
      setFormValues(res.departments);
    });
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await CompanyService.updateCompany(params.id, {
        companyName,
        companyDomain,
        departments: formValues,
      });
      console.log("REs", res);
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
            <h3 className="card-label">Edit Company</h3>
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

export default EditCompany;
