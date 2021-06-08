import React, { useState, useEffect } from 'react';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Spinner, Table, Button, Col, Row, Form, ToggleButton, ButtonGroup } from 'react-bootstrap';
import Select from 'react-select';
import DaumPostcode from 'react-daum-postcode';

import FormInput from './FormInput.tsx';

import server from '../../utils/server';

const { serverFunctions } = server;

const SearchOrder = () => {
    const [data, setData] = useState([]);
    const [check, setCheck] = useState([]);
    const [searching, setSearching] = useState(false);
    const [typecheck, setTypecheck] = useState([]);
    const [memo, setMemo] = useState([]);
    const [send, setSend] = useState([]);
    const [isAddress, setIsAddress] = useState();
    const [isZoneCode, setIsZoneCode] = useState();
    const [extraAddress, setExtraAddress] = useState();
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [products, setProducts] = useState();
    const [selected, setSelected] = useState();
    const [selectNum, setSelectNum] = useState();
    const [customerName, setCustomerName] = useState();
    const [customerPhone, setCustomerPhone] = useState();
    const [back, setBack] = useState();
    const [isAddress1, setIsAddress1] = useState();
    const [isZoneCode1, setIsZoneCode1] = useState();
    const [extraAddress1, setExtraAddress1] = useState();
    const [isPostOpen1, setIsPostOpen1] = useState(false);
    const [selected1, setSelected1] = useState();
    const [selectNum1, setSelectNum1] = useState();
    const [customerName1, setCustomerName1] = useState();
    const [customerPhone1, setCustomerPhone1] = useState();
    const [step2, setStep2] = useState(true);
    const [fee, setFee] = useState(0);

    const findOrder = async input => {
        try {
            setSearching(true);
            const response = await serverFunctions.findOrder(input);
            setData(response);
            setSearching(false);
            setStep2(false);
        } catch (error) {
            alert(error);
        }
    };

    const list_header = {
        'date_receipt': '접수일',
        'seller_name': '판매처',
        'order_id': '주문번호',
        'order_uid': '상품주문번호',
        'order_name': '주문자',
        'order_phone': '연락처',
        'customer_name': '수취인',
        'customer_phone': '연락처',
        'customer_address': '주소',
        'customer_zipcode': '우편번호',
        'product_code': '상품코드',
        'product_name': '상품명',
        'product_num': '수량',
        'order_option': '옵션'
    };

    const cs_type = [{name: '단순반품', value: 1}, {name: '보상반품', value: 2}, {name: '교환/재작업', value: 3}, {name: '재발송', value: 5}, {name: '검수필요', value: 6}];

    const handleSubmit = () => {
        let cs = new Array(), ret = new Array(), ss = new Array();
        if (check.length < 1) {
            alert ('주문건을 선택해주세요');
            return;
        }
            
        back.map((b, i) => {
            cs.push([cs_type[typecheck - 1].name, customerName1, customerPhone1, `${isAddress1} ${extraAddress1}`, isZoneCode1, data[check[i]].order_id, data[check[i]].order_uid, data[check[i]].seller_name, b.code, b.product, b.num, memo, fee]);
            setFee(0);
            if (typecheck != 5 && typecheck != 4) {
                let t = products.filter(x => x.value === b.code);
                ret.push([customerName1, customerPhone1, `${isAddress1} ${extraAddress1}`, isZoneCode1, b.code, b.product, t[0].channel, b.num, memo]);
            }
        })
        if (typecheck == 3 || typecheck == 5) {
            send.map((s) => {
                let t = products.filter(x => x.value === s.code);
                ss.push([customerName, customerPhone, `${isAddress} ${extraAddress}`, isZoneCode, s.code, s.product, t[0].channel, s.num, memo]);
            })
        }

        serverFunctions.getData(cs, ret, ss)
            .then(res => {
                alert('접수완료')
                setMemo('');
                setTypecheck(0);
                setCheck([]);
                setData([]);
                setSend([]);
                setCustomerName([]);
                setCustomerPhone([]);
                setIsAddress([]);
                setIsZoneCode([]);
                setExtraAddress([]);
                setBack([]);
                setCustomerName1([]);
                setCustomerPhone1([]);
                setIsAddress1([]);
                setIsZoneCode1([]);
                setExtraAddress1([]);
            })
            .catch(err => alert(err));
    };

    const handleSingleCheck = (checked, id) => {
        if (checked) {
            setCheck([...check, id]);
        } else {
            setCheck(check.filter((el) => el !== id));
        }
    };

    const selectProduct = value => {
        setSelected(value);
    }

    const selectProduct1 = value => {
        setSelected1(value);
    }

    const addSend = () => {
        if (!selected || !selectNum) {
            alert ('제품 정보를 입력해주세요.');
            return;
        }
        let temp = [...send, {product: selected.label, code: selected.value, num: selectNum}];
        setSelected([]);
        setSelectNum([]);
        setSend(temp);
    }

    const deleteSend = () => {
        setSend(send.slice(0, -1));
    }

    const addBack = () => {
        if (!selected1 || !selectNum1) {
            alert ('제품 정보를 입력해주세요.');
            return;
        }
        let temp = [...back, {product: selected1.label, code: selected1.value, num: selectNum1}];
        setSelected1([]);
        setSelectNum1([]);
        setBack(temp);
    }

    const deleteBack = () => {
        setBack(back.slice(0, -1));
    }

    const handleRadio = (e) => {
        setTypecheck(e.currentTarget.value);
        setSend([]);
        setCustomerName([]);
        setCustomerPhone([]);
        setIsAddress([]);
        setIsZoneCode([]);
        setExtraAddress([]);
        setBack([]);
        setCustomerName1([]);
        setCustomerPhone1([]);
        setIsAddress1([]);
        setIsZoneCode1([]);
        setExtraAddress1([]);
    }

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";
    
        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setIsZoneCode(data.zonecode);
        setIsAddress(fullAddress);
        setIsPostOpen(false);
    };

    const handleComplete1 = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";
    
        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setIsZoneCode1(data.zonecode);
        setIsAddress1(fullAddress);
        setIsPostOpen1(false);
    };

    const handlePost = () => {
        setIsPostOpen(!isPostOpen);
    }

    const handlePost1 = () => {
        setIsPostOpen1(!isPostOpen1);
    }

    const handleCopy = () => {
        if (check.length > 0) {
            setIsAddress(data[check[0]].customer_address);
            setIsZoneCode(data[check[0]].customer_zipcode);
            let temp = [...send];
            let alertText = ''
            check.map((c) => {
                if (products.findIndex(x => x.value === data[c].product_code) > -1) {
                    temp.push({product: data[c].product_name, code: data[c].product_code, num: data[c].product_num});
                } else {
                    alertText += `${data[c].product_code} `;
                }
            })
            if (alertText.length > 0) {
                alert(`${alertText}제품은 현재 발송 불가능합니다`);
            }
            setSend(temp);
            setCustomerName(data[check[0]].customer_name);
            setCustomerPhone(data[check[0]].customer_phone);
        }
    }

    const handleCopy1 = () => {
        if (check.length > 0) {
            setIsAddress1(data[check[0]].customer_address);
            setIsZoneCode1(data[check[0]].customer_zipcode);
            let temp = [...back];
            check.map((c) => {
                if (products.findIndex(x => x.value === data[c].product_code) > -1) {
                    temp.push({product: data[c].product_name, code: data[c].product_code, num: data[c].product_num});
                }
            })
            setBack(temp);
            setCustomerName1(data[check[0]].customer_name);
            setCustomerPhone1(data[check[0]].customer_phone);
        }
    }

    const postCodeStyle = {
        width: "100%",
        height: '500px',
        padding: "7px",
    };
    

    useEffect(() => {
        const fetch = async() => {
            try {
                const result = await serverFunctions.getProducts();
                setProducts(result);
            } catch (error) {
                alert(error);
            }
        }
        fetch();
        // setProducts(serverFunctions.getProducts());
    }, []);


    return (
        <div style={{ padding: '3px', fontSize: 12, width: 1490}}>
            <FormInput findOrder={findOrder}/>
            <div>
                {searching ? 
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Spinner animation="border" role="status" />
                    </div> :
                    <div className='tableWrap'>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th className='check'>
                                    <div className='data_div'>
                                        <Form>
                                            <Form.Check type="checkbox" checked="true" disabled />
                                        </Form>
                                    </div>
                                </th>
                                {Object.keys(list_header).map((k) => (
                                    !(k == 'order_id' || k == 'order_uid' || k == 'customer_zipcode') && 
                                    <th className={k}>
                                        <div className='data_div'>
                                            {list_header[k]}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 &&
                                Object.keys(data).map((key) => (
                                    <tr>
                                        <td className='check'>
                                            <Form>
                                                <Form.Check type="checkbox" onChange={(e) => handleSingleCheck(e.target.checked, key)} checked={check.includes(key) ? true : false} />
                                            </Form>
                                        </td>
                                        {Object.keys(list_header).map((k) => (
                                            !(k == 'order_id' || k == 'order_uid' || k == 'customer_zipcode') && 
                                            <td className={k}>
                                                <div className='data_div'>
                                                    {data[key][k]}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                    </div>
                }

                <hr />
                <div>
                    <ButtonGroup toggle>
                        {cs_type.map((k, i) => (
                            <ToggleButton size='sm' type='radio' key={i} variant="outline-secondary" value={k.value} checked={typecheck == k.value} onChange={handleRadio}>
                                {k.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </div>
                <div style={{marginTop: 15}}>
                    <Form.Group>
                        <Form.Label className='title'>메모</Form.Label>
                        <Form.Control as="textarea" rows={2} value={memo} onChange={(e) => setMemo(e.currentTarget.value)} />
                    </Form.Group>
                </div>

                {(typecheck == 1 || typecheck == 2 || typecheck == 3 || typecheck == 6) &&
                    <div>
                        <hr />
                        <div className='title'>
                            상품 회수
                            <Button size='sm' variant='outline-secondary' style={{marginLeft: 1350}} onClick={handleCopy1}>검색내용 적용하기</Button>
                        </div>
                        <div style={{marginTop: 10}}>
                            <Form style={{marginLeft: 100, marginRight: 100}}>
                                <Row>
                                    <Col>
                                        <Form.Label size='sm'>수령인명</Form.Label>
                                        <Form.Control size='sm' type='text' style={{width: 200}} value={customerName1} onChange={(e) => setCustomerName1(e.currentTarget.value)} />
                                    </Col>
                                    <Col>
                                        <Form.Label size='sm'>연락처</Form.Label>
                                        <Form.Control size='sm' type='text' style={{width: 200}} value={customerPhone1} onChange={(e) => setCustomerPhone1(e.currentTarget.value)} />
                                    </Col>
                                    <Col>
                                        <Form.Label size='sm'>반품배송비</Form.Label>
                                        <Form.Control size='sm' type='text' style={{width: 200}} value={fee} onChange={(e) => setFee(e.currentTarget.value)} />
                                    </Col>
                                    <Col /><Col /><Col />
                                </Row>
                                <br />
                                <Form.Label size='sm'>주소</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control size='sm' type='text' value={isAddress1} disabled />
                                    </Col>
                                    <Col>
                                        <Form.Control size='sm' type='text' value={extraAddress1} onChange={(e) => setExtraAddress1(e.currentTarget.value)} />
                                    </Col>
                                    <Col>
                                        <Form.Control size='sm' type='text' value={isZoneCode1} disabled style={{width: 100}} />
                                    </Col>
                                </Row>
                                <br />
                                <Button size='sm' variant='outline-secondary' onClick={handlePost1}>검색</Button>
                                {isPostOpen1 && <DaumPostcode style={postCodeStyle} onComplete={handleComplete1} />}
                                <br />
                                <br />
                                <Form.Label size='sm'>제품</Form.Label>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div style={{width: 1000}}>
                                        <Select menuPlacement='top' options={products} value={selected1} onChange={selectProduct1} />
                                    </div>
                                    <div style={{width: 150}}>
                                        <Form.Control type="text" value={selectNum1} onChange={(e) => setSelectNum1(e.currentTarget.value)} />
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <Button size='sm' variant="outline-secondary" onClick={addBack}>
                                            추가
                                        </Button>
                                        <div style={{width: 5}} />
                                        <Button size='sm' variant="outline-secondary" onClick={deleteBack}>
                                            제거
                                        </Button>
                                    </div>
                                </div>
                                {back.map((b, i) => (
                                    <div style={{width: 1200, display: 'flex', marginTop: 10}}>
                                        <div style={{width: 490, marginRight: 20}}>
                                            <Form.Control size='sm' type="text" disabled value={b.product} />
                                        </div>
                                        <div style={{width: 490, marginRight: 20}}>
                                            <Form.Control size='sm' type="text" disabled value={b.code} />
                                        </div>
                                        <div style={{width: 150}}>
                                            <Form.Control size='sm' type="text" defaultValue={b.num} onChange={(e) => {
                                                let temp = back;
                                                temp[i].num = e.currentTarget.value;
                                                setBack(temp);
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </Form>
                        </div>
                    </div>
                }

                {(typecheck == 3 || typecheck == 5) &&
                    <div>
                        <hr />
                        <div className='title'>
                            상품 발송
                            <Button size='sm' variant='outline-secondary' style={{marginLeft: 1350}} onClick={handleCopy}>검색내용 적용하기</Button>
                        </div>
                        <div style={{marginTop: 10}}>
                            <Form style={{marginLeft: 100, marginRight: 100}}>
                                <Row>
                                    <Col>
                                        <Form.Label size='sm'>수령인명</Form.Label>
                                        <Form.Control size='sm' type='text' style={{width: 200}} value={customerName} onChange={(e) => setCustomerName(e.currentTarget.value)} />
                                    </Col>
                                    <Col>
                                        <Form.Label size='sm'>연락처</Form.Label>
                                        <Form.Control size='sm' type='text' style={{width: 200}} value={customerPhone} onChange={(e) => setCustomerPhone(e.currentTarget.value)} />
                                    </Col>
                                    <Col /><Col /><Col /><Col />
                                </Row>
                                <br />
                                <Form.Label size='sm'>주소</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control size='sm' type='text' value={isAddress} disabled />
                                    </Col>
                                    <Col>
                                        <Form.Control size='sm' type='text' value={extraAddress} onChange={(e) => setExtraAddress(e.currentTarget.value)} />
                                    </Col>
                                    <Col>
                                        <Form.Control size='sm' type='text' value={isZoneCode} disabled style={{width: 100}} />
                                    </Col>
                                </Row>
                                <br />
                                <Button size='sm' variant='outline-secondary' onClick={handlePost}>검색</Button>
                                {isPostOpen && <DaumPostcode style={postCodeStyle} onComplete={handleComplete} />}
                                <br />
                                <br />
                                <Form.Label size='sm'>제품</Form.Label>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div style={{width: 1000}}>
                                        <Select menuPlacement='top' options={products} value={selected} onChange={selectProduct} />
                                    </div>
                                    <div style={{width: 150}}>
                                        <Form.Control type="text" value={selectNum} onChange={(e) => setSelectNum(e.currentTarget.value)} />
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <Button size='sm' variant="outline-secondary" onClick={addSend}>
                                            추가
                                        </Button>
                                        <div style={{width: 5}} />
                                        <Button size='sm' variant="outline-secondary" onClick={deleteSend}>
                                            제거
                                        </Button>
                                    </div>
                                </div>
                                {send.map((s, i) => (
                                    <div style={{width: 1200, display: 'flex', marginTop: 10}}>
                                        <div style={{width: 490, marginRight: 20}}>
                                            <Form.Control size='sm' type="text" disabled value={s.product} />
                                        </div>
                                        <div style={{width: 490, marginRight: 20}}>
                                            <Form.Control size='sm' type="text" disabled value={s.code} />
                                        </div>
                                        <Form.Control size='sm' type="text" defaultValue={s.num} onChange={(e) => {
                                                let temp = send;
                                                temp[i].num = e.currentTarget.value;
                                                setSend(temp);
                                            }} />
                                    </div>
                                ))}
                            </Form>
                        </div>
                        {/* {Object.keys(send).map((i) => (
                            <div key={i}>
                                test
                            </div>
                        ))} */}
                    </div>
                }

                <hr />
                <div>
                    {/* <Button variant="primary" type="submit" onClick={handleSubmit} disabled={!(check.length > 0 && typecheck > 0)}> */}
                    <Button variant="primary" size='sm' type="submit" onClick={handleSubmit} disabled={step2}>
                        제출
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default SearchOrder;
