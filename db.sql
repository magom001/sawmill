--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 9.5.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: factory; Type: SCHEMA; Schema: -; Owner: magom001
--

CREATE SCHEMA factory;


ALTER SCHEMA factory OWNER TO magom001;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA factory;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA factory;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


SET search_path = factory, pg_catalog;

--
-- Name: assign_docnum(integer, integer); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION assign_docnum(doctype integer, docyear integer) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
declare
newdocnum integer;
begin
select coalesce(max(doc.docnum),0)+1 into newdocnum from document doc where doc.doctype = $1 and doc.docyear = $2;
return newdocnum;
end;
$_$;


ALTER FUNCTION factory.assign_docnum(doctype integer, docyear integer) OWNER TO magom001;

--
-- Name: create_new_stack(integer, integer, integer, integer, text, integer, integer, integer, integer); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION create_new_stack(fdoctype integer, fdocnum integer, fdocyear integer, fwh integer, fstackid text, fspeciesid integer, fdimensionid integer, flengthid integer, fquantity integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
insert into factory.stack(id, speciesid, dimensionid, lengthid) values(fstackid, fspeciesid, fdimensionid, flengthid);
insert into factory.docdetail(doctype, docyear, docnum, wh, stackid, quantity) values (fdoctype, fdocyear, fdocnum,fwh,fstackid, fquantity);
exception
when unique_violation then
raise exception 'Повторяющийся номер штабеля: %', fstackid;

end; $$;


ALTER FUNCTION factory.create_new_stack(fdoctype integer, fdocnum integer, fdocyear integer, fwh integer, fstackid text, fspeciesid integer, fdimensionid integer, flengthid integer, fquantity integer) OWNER TO magom001;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: document; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE document (
    doctype integer NOT NULL,
    docyear integer NOT NULL,
    docnum integer NOT NULL,
    docdate date DEFAULT now(),
    wh integer NOT NULL,
    commentary text,
    doctype_ref integer,
    docyear_ref integer,
    docnum_ref integer,
    wh_ref integer,
    employee integer DEFAULT 1 NOT NULL,
    docmonth integer
);


ALTER TABLE document OWNER TO magom001;

--
-- Name: move_stack_document(integer, integer, integer, integer); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION move_stack_document(doctype integer, from_wh integer, to_wh integer, year integer) RETURNS document
    LANGUAGE plpgsql
    AS $_$
declare
tmp document%rowtype;
begin
insert into document(doctype, docyear, wh) values (2, $4, from_wh) returning * into tmp;
insert into document(doctype, docyear,wh,doctype_ref,docyear_ref,docnum_ref,wh_ref) values ($1,$4, to_wh,tmp.doctype,tmp.docyear, tmp.docnum, tmp.wh) returning * into tmp;
return tmp;
end;$_$;


ALTER FUNCTION factory.move_stack_document(doctype integer, from_wh integer, to_wh integer, year integer) OWNER TO magom001;

--
-- Name: docdetail; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE docdetail (
    doctype integer NOT NULL,
    docyear integer NOT NULL,
    docnum integer NOT NULL,
    stackid text NOT NULL,
    wh integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE docdetail OWNER TO magom001;

--
-- Name: move_stock_docdetail(integer, integer, integer, text, integer); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION move_stock_docdetail(doctype integer, docyear integer, docnum integer, stack text, quantity integer) RETURNS docdetail
    LANGUAGE plpgsql
    AS $_$
declare
doc document%rowtype;
dd docdetail%rowtype;
begin
select * into doc from document where document.doctype=$1 and document.docyear = $2 and document.docnum=$3;
if not found then
raise exception 'Документ не найден';
end if;
insert into docdetail(doctype, docyear, docnum, wh, stackid, quantity) values(doc.doctype_ref, doc.docyear_ref, doc.docnum_ref, doc.wh_ref, stack, quantity);
insert into docdetail(doctype, docyear, docnum, wh, stackid, quantity) values(doc.doctype, doc.docyear, doc.docnum, doc.wh, stack, quantity) returning * into dd;
return dd;
end;$_$;


ALTER FUNCTION factory.move_stock_docdetail(doctype integer, docyear integer, docnum integer, stack text, quantity integer) OWNER TO magom001;

--
-- Name: trg_extract_month(); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION trg_extract_month() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
new.docmonth = extract(month from new.docdate);
return new;
end;
$$;


ALTER FUNCTION factory.trg_extract_month() OWNER TO magom001;

--
-- Name: trigger_assign_docnum(); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION trigger_assign_docnum() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
new.docnum :=assign_docnum(new.doctype, new.docyear);
return new;
end;
$$;


ALTER FUNCTION factory.trigger_assign_docnum() OWNER TO magom001;

--
-- Name: dimension; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE dimension (
    id integer NOT NULL,
    thickness_mm integer NOT NULL,
    width_mm integer NOT NULL
);


ALTER TABLE dimension OWNER TO magom001;

--
-- Name: dimension_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE dimension_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dimension_id_seq OWNER TO magom001;

--
-- Name: dimension_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE dimension_id_seq OWNED BY dimension.id;


--
-- Name: doctype; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE doctype (
    id integer NOT NULL,
    docname text NOT NULL,
    docsign integer NOT NULL
);


ALTER TABLE doctype OWNER TO magom001;

--
-- Name: doctype_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE doctype_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE doctype_id_seq OWNER TO magom001;

--
-- Name: doctype_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE doctype_id_seq OWNED BY doctype.id;


--
-- Name: documents_employees; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE documents_employees (
    doctype integer NOT NULL,
    docyear integer NOT NULL,
    docnum integer NOT NULL,
    wh integer NOT NULL,
    employee integer NOT NULL
);


ALTER TABLE documents_employees OWNER TO magom001;

--
-- Name: employee; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE employee (
    id integer NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    profession text NOT NULL,
    employedfrom date NOT NULL,
    employedtill date,
    middlename text
);


ALTER TABLE employee OWNER TO magom001;

--
-- Name: employee_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE employee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE employee_id_seq OWNER TO magom001;

--
-- Name: employee_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE employee_id_seq OWNED BY employee.id;


--
-- Name: length; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE length (
    id integer NOT NULL,
    length_mm integer NOT NULL
);


ALTER TABLE length OWNER TO magom001;

--
-- Name: length_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE length_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE length_id_seq OWNER TO magom001;

--
-- Name: length_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE length_id_seq OWNED BY length.id;


--
-- Name: species; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE species (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE species OWNER TO magom001;

--
-- Name: species_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE species_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE species_id_seq OWNER TO magom001;

--
-- Name: species_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE species_id_seq OWNED BY species.id;


--
-- Name: stack; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE stack (
    id text NOT NULL,
    speciesid integer,
    dimensionid integer,
    lengthid integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE stack OWNER TO magom001;

--
-- Name: stacks_list_view; Type: VIEW; Schema: factory; Owner: magom001
--

CREATE VIEW stacks_list_view AS
 SELECT stack.id,
    species.name AS species,
    concat(dimension.thickness_mm, 'x', dimension.width_mm, 'x', length.length_mm) AS size
   FROM (((stack
     JOIN dimension ON ((stack.dimensionid = dimension.id)))
     JOIN species ON ((stack.speciesid = species.id)))
     JOIN length ON ((stack.lengthid = length.id)));


ALTER TABLE stacks_list_view OWNER TO magom001;

--
-- Name: warehouse; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE warehouse (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE warehouse OWNER TO magom001;

--
-- Name: stock_view; Type: VIEW; Schema: factory; Owner: magom001
--

CREATE VIEW stock_view AS
 SELECT dd.stackid,
    dd.wh,
    warehouse.name,
    s.species,
    s.size,
    sum((dd.quantity * dt.docsign)) AS quantity
   FROM (((docdetail dd
     JOIN doctype dt ON ((dd.doctype = dt.id)))
     JOIN stacks_list_view s ON ((s.id = dd.stackid)))
     JOIN warehouse ON ((warehouse.id = dd.wh)))
  GROUP BY dd.stackid, dd.wh, warehouse.name, s.species, s.size
 HAVING (sum((dd.quantity * dt.docsign)) > 0);


ALTER TABLE stock_view OWNER TO magom001;

--
-- Name: stock_by_spec_view; Type: VIEW; Schema: factory; Owner: magom001
--

CREATE VIEW stock_by_spec_view AS
 SELECT concat(stock_view.species, ' ', stock_view.size) AS specification,
    stock_view.wh,
    stock_view.name,
    sum(stock_view.quantity) AS sum
   FROM stock_view
  GROUP BY (concat(stock_view.species, ' ', stock_view.size)), stock_view.wh, stock_view.name;


ALTER TABLE stock_by_spec_view OWNER TO magom001;

--
-- Name: warehouse_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE warehouse_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE warehouse_id_seq OWNER TO magom001;

--
-- Name: warehouse_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE warehouse_id_seq OWNED BY warehouse.id;


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY dimension ALTER COLUMN id SET DEFAULT nextval('dimension_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY doctype ALTER COLUMN id SET DEFAULT nextval('doctype_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY employee ALTER COLUMN id SET DEFAULT nextval('employee_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY length ALTER COLUMN id SET DEFAULT nextval('length_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY species ALTER COLUMN id SET DEFAULT nextval('species_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY warehouse ALTER COLUMN id SET DEFAULT nextval('warehouse_id_seq'::regclass);


--
-- Data for Name: dimension; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY dimension (id, thickness_mm, width_mm) FROM stdin;
1	30	100
2	30	125
3	30	150
\.


--
-- Name: dimension_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('dimension_id_seq', 3, true);


--
-- Data for Name: docdetail; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY docdetail (doctype, docyear, docnum, stackid, wh, quantity) FROM stdin;
1	2017	1	111	1	1000
1	2017	1	112	1	1000
1	2017	1	113	1	1000
1	2017	1	114	1	999
2	2017	1	114	1	999
3	2017	1	114	2	999
2	2017	2	111	1	1000
3	2017	2	111	2	1000
1	2017	1	115	1	777
1	2017	1	116	1	666
1	2017	1	117	1	555
1	2017	1	118	1	555
1	2017	1	119	1	988
1	2017	1	120	1	500
\.


--
-- Data for Name: doctype; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY doctype (id, docname, docsign) FROM stdin;
1	Выпуск сушильных штабелей	1
2	Списание сушильных штабелей	-1
3	Оприходование сушильных штабелей	1
\.


--
-- Name: doctype_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('doctype_id_seq', 3, true);


--
-- Data for Name: document; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY document (doctype, docyear, docnum, docdate, wh, commentary, doctype_ref, docyear_ref, docnum_ref, wh_ref, employee, docmonth) FROM stdin;
2	2017	1	2017-12-04	1	\N	\N	\N	\N	\N	1	12
3	2017	1	2017-12-04	2	\N	\N	\N	\N	\N	1	12
2	2017	2	2017-12-05	1	\N	\N	\N	\N	\N	1	12
3	2017	2	2017-12-05	2	\N	2	2017	2	1	1	12
1	2017	1	2017-12-02	1	Первый документ	\N	\N	\N	\N	1	12
\.


--
-- Data for Name: documents_employees; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY documents_employees (doctype, docyear, docnum, wh, employee) FROM stdin;
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY employee (id, firstname, lastname, profession, employedfrom, employedtill, middlename) FROM stdin;
1	Иван	Иванов	станочник	2017-05-01	\N	Иванович
\.


--
-- Name: employee_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('employee_id_seq', 1, true);


--
-- Data for Name: length; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY length (id, length_mm) FROM stdin;
1	4000
2	6000
\.


--
-- Name: length_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('length_id_seq', 2, true);


--
-- Data for Name: species; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY species (id, name) FROM stdin;
1	Ель обыкновенная
2	Сосна обыкновенная
\.


--
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('species_id_seq', 2, true);


--
-- Data for Name: stack; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY stack (id, speciesid, dimensionid, lengthid, created_at) FROM stdin;
111	1	1	1	2017-12-02 18:51:04.252033
112	1	1	1	2017-12-02 18:51:04.252033
113	1	2	1	2017-12-02 18:51:04.252033
114	1	1	1	2017-12-04 14:26:40.613182
115	1	1	1	2017-12-06 17:02:56.325712
116	1	1	1	2017-12-06 17:07:06.281797
117	1	2	1	2017-12-06 17:08:45.208638
118	1	1	1	2017-12-06 17:09:32.541644
119	1	3	1	2017-12-06 17:38:44.509884
120	1	2	1	2017-12-06 18:10:19.749066
\.


--
-- Data for Name: warehouse; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY warehouse (id, name) FROM stdin;
1	Склад сырого полуфабриката
2	Сушильная камера № 1
3	Сушильная камера № 2
\.


--
-- Name: warehouse_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('warehouse_id_seq', 3, true);


--
-- Name: dimension_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY dimension
    ADD CONSTRAINT dimension_pkey PRIMARY KEY (id);


--
-- Name: doctype_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY doctype
    ADD CONSTRAINT doctype_pkey PRIMARY KEY (id);


--
-- Name: employee_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (id);


--
-- Name: length_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY length
    ADD CONSTRAINT length_pkey PRIMARY KEY (id);


--
-- Name: pk_docdetail; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY docdetail
    ADD CONSTRAINT pk_docdetail PRIMARY KEY (doctype, docyear, docnum, stackid);


--
-- Name: pk_document; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT pk_document PRIMARY KEY (doctype, docnum, docyear, wh);


--
-- Name: species_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY species
    ADD CONSTRAINT species_pkey PRIMARY KEY (id);


--
-- Name: stack_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_pkey PRIMARY KEY (id);


--
-- Name: u_dimension; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY dimension
    ADD CONSTRAINT u_dimension UNIQUE (thickness_mm, width_mm);


--
-- Name: warehouse_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (id);


--
-- Name: trg_biu_document_month; Type: TRIGGER; Schema: factory; Owner: magom001
--

CREATE TRIGGER trg_biu_document_month BEFORE INSERT OR UPDATE ON document FOR EACH ROW EXECUTE PROCEDURE trg_extract_month();


--
-- Name: trg_row_bi_document; Type: TRIGGER; Schema: factory; Owner: magom001
--

CREATE TRIGGER trg_row_bi_document BEFORE INSERT ON document FOR EACH ROW EXECUTE PROCEDURE trigger_assign_docnum();


--
-- Name: document_doctype_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_doctype_fkey FOREIGN KEY (doctype) REFERENCES doctype(id);


--
-- Name: document_employee_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_employee_fkey FOREIGN KEY (employee) REFERENCES employee(id);


--
-- Name: document_wh_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_wh_fkey FOREIGN KEY (wh) REFERENCES warehouse(id);


--
-- Name: fk_de_documents; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY documents_employees
    ADD CONSTRAINT fk_de_documents FOREIGN KEY (doctype, docyear, docnum, wh) REFERENCES document(doctype, docyear, docnum, wh);


--
-- Name: fk_de_employee; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY documents_employees
    ADD CONSTRAINT fk_de_employee FOREIGN KEY (employee) REFERENCES employee(id);


--
-- Name: fk_docdetail_document; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY docdetail
    ADD CONSTRAINT fk_docdetail_document FOREIGN KEY (docnum, doctype, docyear, wh) REFERENCES document(docnum, doctype, docyear, wh);


--
-- Name: fk_docdetail_stack; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY docdetail
    ADD CONSTRAINT fk_docdetail_stack FOREIGN KEY (stackid) REFERENCES stack(id);


--
-- Name: fk_document_document; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT fk_document_document FOREIGN KEY (doctype_ref, docyear_ref, docnum_ref, wh_ref) REFERENCES document(doctype, docyear, docnum, wh);


--
-- Name: stack_dimensionid_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_dimensionid_fkey FOREIGN KEY (dimensionid) REFERENCES dimension(id);


--
-- Name: stack_lengthid_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_lengthid_fkey FOREIGN KEY (lengthid) REFERENCES length(id);


--
-- Name: stack_speciesid_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_speciesid_fkey FOREIGN KEY (speciesid) REFERENCES species(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

