// Programme content for the Departments → Programmes pages, taken from the College's own programme
// pages at www.sherubtse.edu.bt (read 25 Oct 2026). Entry requirements and seats are the Admissions
// guide's, so both pages agree. Loaded once by seed-programmes.ts into empty fields only; after that,
// everything is edited in Strapi → Academics – Programmes. Generated; do not edit by hand.
export interface ProgrammeSeed {
  programme_name?: string;
  level: "undergraduate";
  degree_type: string;
  duration: string;
  short_description: string;
  overview: string;
  about?: string;
  learning_outcomes?: string;
  key_skills?: string;
  highlights?: string;
  teaching_assessment?: string;
  resources?: string;
  career_opportunities?: string;
  further_study?: string;
  admission_requirements: string;
  seats: string;
  contact_email: string;
  contact_note?: string;
  curriculum: { label: string; courses: string }[];
  testimonials: { quote: string; name: string; detail: string }[];
}

export const PROGRAMME_SEED: Record<string, ProgrammeSeed> = {
  "economics-political-science": {
    "level": "undergraduate",
    "programme_name": "Bachelor of Economics & Political Science",
    "degree_type": "Bachelor of Economics and Political Science (EPS)",
    "duration": "3 years, full-time",
    "overview": "The Bachelor of Economics and Political Science is a three-year, full-time degree that equips students to navigate today’s interconnected world of markets, governance, and policy. In an era shaped by globalization, climate change, digital economies, and shifting political landscapes, this programme offers analytical tools and practical skills to understand, evaluate, and influence change. It is distinctive for its applied, hands-on approach, where students tackle real-world economic and governance challenges through field surveys, simulations, and debates. Students develop practical skills in econometrics and data analysis using tools such as Excel, R, and Python, and complete a capstone research project culminating in actionable policy recommendations. Through engagement with Bhutanese communities and government institutions, students connect theory with practice while gaining a global perspective with local relevance—preparing them for careers in government, development, research, or further study.",
    "short_description": "The Bachelor of Economics and Political Science is a three-year, full-time degree that equips students to navigate today’s interconnected world of markets, governance, and policy.",
    "about": "This programme is ideal for students wishing to engage deeply with real-world challenges in governance, policy, and economic development. It suits individuals who enjoy working with data, conducting field research, and applying analytical reasoning to solve complex policy problems through evidence-based insights and simulations.",
    "learning_outcomes": "- Analyse and interpret economic and political data to inform policy and development decisions.\n- Conduct field surveys and applied research to generate evidence-based insights.\n- Apply econometric and statistical tools (R, Excel, Python) to evaluate real-world issues such as trade, employment, and governance.\n- Develop actionable policy briefs, reports, and recommendations for government, NGOs, and development agencies.\n- Participate in policy simulations and scenario exercises to practice decision-making and problem-solving.\n- Communicate complex information clearly to diverse audiences.\n\nLead and collaborate in multi-disciplinary teams, managing end-to-end research and capstone projects.",
    "teaching_assessment": "Students learn through interactive lectures, hands-on workshops and labs for econometrics and data analysis, policy simulations, debates, case studies, and field surveys. Guided mini-projects help students apply theory to real-world problems.\n\nIncludes written assignments, quizzes, exams, projects, mini research studies, capstone projects, portfolios, and presentations. Applied econometrics exercises and policy briefs assess both analytical and communication skills.",
    "resources": "Students have access to Economics & Policy lab spaces with computers, statistical software (Python, R, Excel), and econometric tools; Sherubtse Digital Studio for policy simulations, scenario exercises, debates, and interactive workshops; research and fieldwork support for surveys and community engagement; library and e-resources; collaborative project spaces for team-based learning; and professional partnerships with government institutions, NGOs, and development agencies for applied learning, internships, and capstone projects.",
    "career_opportunities": "Graduates are prepared for roles such as Policy Analyst, Economic Researcher, Public Policy Consultant (UNDP, World Bank, ADB), Development Officer, Governance Specialist, Trade & Investment Analyst, Financial Analyst, Economic Advisor, Central Bank Research Officer, Corporate Strategy Analyst, and Data & Policy Analyst. Career paths span government agencies, central banks, financial institutions, NGOs, development organisations, research centres, and private corporations. Graduates may also pursue consultancy, remote research, or entrepreneurial ventures.",
    "further_study": "The programme provides a strong foundation for postgraduate studies in economics, political science, public policy, finance, development studies, international relations, and applied research disciplines.",
    "curriculum": [
      {
        "label": "Year I – Foundations",
        "courses": "Focus on building core conceptual and analytical skills. Students study foundational subjects in economics, project management, statistical computing, Python programming, digital communication, academic research, and Dzongkha. Elective courses begin in Semester II to allow early exploration."
      },
      {
        "label": "Year II – Core Analysis & Applied Skills",
        "courses": "Students deepen understanding in microeconomics, macroeconomics, development and behavioural economics, politics, international relations, public policy, monetary economics, and applied econometrics. Elective courses continue to provide interdisciplinary exposure."
      },
      {
        "label": "Year III – Applied & Experiential Learning",
        "courses": "Focuses on advanced applied econometrics, public finance, global political economy, and deep domain mini-projects. Students complete a professional certificate specialization and an Industry Capstone Project to synthesize learning and gain real-world experience. Electives continue in both semesters."
      }
    ],
    "testimonials": [
      {
        "quote": "The EPS programme combines economics, political science, data skills, and project work—it’s practical and hands-on. Field surveys, policy simulations, and the capstone project have helped me connect classroom learning to real-world challenges. EPS doesn’t just prepare you for a career; it teaches you to think critically and engage meaningfully with the world.",
        "name": "Kezang Choden Namgyel",
        "detail": "Year 3, Sem I"
      },
      {
        "quote": "EPS provides a strong foundation in economics and political science, blending theory with practical application. Modules like Microeconomics, Public Policy, and Applied Econometrics sharpen analytical and problem-solving skills while hands-on activities strengthen critical thinking and communication.",
        "name": "Sonam Yangden",
        "detail": "Year 3, Sem I"
      }
    ],
    "highlights": "The EPS programme provides students with a hands-on and applied learning environment where they can tackle real-world economic and governance challenges through field surveys, policy simulations, and community projects. It develops data-driven skills in econometrics, statistical analysis, and computational tools, preparing students for careers that demand analytical thinking, problem-solving, effective communication, and project management. The programme uniquely connects global trends with Bhutan’s local development priorities, ensuring graduates are ready to make meaningful contributions both nationally and internationally.",
    "admission_requirements": "Class XII pass with at least 50% in Maths/B.Maths.\n\nMerit-ranked on subject ability rating points (Maths/B.Maths 5, English 3, Dzongkha 3, any 2 other subjects 1). Shortlisted applicants sit the Data Visualisation Test; final selection is on the DVT merit ranking.",
    "seats": "30 government scholarship · 10 self-financed",
    "contact_email": "admission.sherubtse@rub.edu.bt"
  },
  "digital-communication-project-management": {
    "level": "undergraduate",
    "degree_type": "Bachelor of Digital Communication and Project Management (BDCPM)",
    "duration": "3 years (6 semesters), full-time",
    "overview": "The Bachelor of Digital Communications and Project Management (DCPM) at Sherubtse College is the first programme of its kind in Bhutan. It uniquely integrates digital communication strategies with professional project management, preparing graduates to lead in today’s fast-evolving digital economy.\n\nThis three-year, full-time programme equips you with the ability to plan, manage, and deliver complex projects while mastering the tools and creativity of modern digital communication. Combining technical expertise, leadership training, and ethical awareness, DCPM graduates are industry-ready professionals who can contribute to Bhutan’s vision of a knowledge-based, globally connected, and values-driven society.",
    "short_description": "The Bachelor of Digital Communications and Project Management (DCPM) at Sherubtse College is the first programme of its kind in Bhutan.",
    "about": "This programme is ideal for:\n- Students interested in careers that combine technology, communication, and management\n- Aspiring leaders who want to develop skills in digital media, analytics, and project execution\n- Learners seeking both practical, hands-on experience and strong theoretical foundations",
    "learning_outcomes": "- Lead and manage diverse projects across sectors using structured frameworks\n- Apply project management principles to scope, schedule, quality, and risk management\n- Design and implement creative, data-driven digital communication strategies\n- Use analytics to interpret data and inform decisions\n- Create, present, and evaluate digital content effectively\n- Demonstrate teamwork, negotiation, and leadership in multicultural environments\n- Solve problems critically, think strategically, and adapt to complex contexts\n- Uphold professional ethics, social responsibility, and accountability",
    "key_skills": "- Project planning, execution, and evaluation\n- Digital media design and strategy\n- Data analysis and visualization\n- Business analytics and risk management\n- Leadership, communication, and public speaking",
    "teaching_assessment": "Learning is highly practical— 80% applied and 20% theoretical —delivered through interactive lectures, workshops, case studies, prototype design, and experiential projects. You’ll work in teams, apply digital tools, and reflect on real-world challenges.\n\nAssessment is continuous and varied, including written assignments, reports, presentations, practical demonstrations, quizzes, and group work. The Capstone Project is assessed through a written report (70%) and an oral presentation (30%) .",
    "resources": "- Modern computer labs with data analytics and communication software\n- Access to digital media tools for design, content creation, and analytics\n- Guest lectures, industry workshops, and internship opportunities\n- A vibrant learning community within Sherubtse and the Royal University of Bhutan network",
    "career_opportunities": "Graduates of the BDCPM programme are in demand across industries. Career pathways include:\n- Project Manager – leading projects in business, IT, or development sectors\n- Business Analyst – bridging data, operations, and decision-making\n- Operations or IT Project Manager – coordinating systems and processes\n- Event or Communication Specialist – managing campaigns and media content",
    "curriculum": [
      {
        "label": "Year 1 – Foundations",
        "courses": "Introduction to Project Management, Python Programming, Data Science, Statistical Computing, Digital Communication, and Academic Research Skills, plus Dzongkha and electives."
      },
      {
        "label": "Year 2 – Core Development",
        "courses": "Agile Project Management, Project Governance, Communication in the Digital World, Storyboarding, Web Analytics, Gamification, and Risk & Quality Management, with elective options."
      },
      {
        "label": "Year 3 – Advanced & Applied",
        "courses": "Advanced Project Management, HRM & Leadership, Career Development Skills, mini-projects, and an intensive Capstone Project (36 credits) offering industry exposure and professional supervision."
      }
    ],
    "testimonials": [
      {
        "quote": "The DCPM course at Sherubtse College was a truly transformative experience. Along with a well-structured curriculum and real-world case studies, the beautiful campus, excellent facilities, and supportive learning environment made my academic journey enriching and inspiring.",
        "name": "Kezang Dorji",
        "detail": "Year III, Semester I"
      },
      {
        "quote": "As Bhutan moves toward a more innovative future with projects like Gelephu Mindfulness City, I now see how vital this course is. Using tools like Microsoft Project and learning through real scenarios makes me feel ready to contribute meaningfully to our country’s growth.",
        "name": "Rignam Kinley Seldon",
        "detail": "Year III, Semester I"
      }
    ],
    "highlights": "- Bhutan’s first degree blending project management and digital communication\n- 80% applied, industry-focused learning\n- Real-world experience through a semester-long Capstone Project\n- Opportunities for innovation, leadership, and entrepreneurship\n- Supportive learning community guided by GNH values",
    "admission_requirements": "Class XII pass with at least 50% in Maths/B.Maths.\n\nMerit-ranked on subject ability rating points (Maths/B.Maths 5, English 3, Dzongkha 3, any 2 other subjects 1). Shortlisted applicants sit the Data Visualisation Test; final selection is on the DVT merit ranking.",
    "seats": "30 government scholarship · 10 self-financed",
    "contact_email": "admission.sherubtse@rub.edu.bt"
  },
  "bachelor-of-data-science-data-analytics": {
    "level": "undergraduate",
    "degree_type": "Bachelor of Data Science and Data Analytics (DSDA)",
    "duration": "4 years (8 semesters), full-time",
    "overview": "The Bachelor of Data Science and Data Analytics (DSDA) is a four-year, full-time programme that blends statistics, mathematics, computer science, and domain knowledge to transform raw data into actionable insights. You will learn how to collect, manage, analyse, and communicate with data—progressing from foundational skills to advanced analytics and artificial intelligence—through real projects, modern tools, and a strong ethical framework.",
    "short_description": "The Bachelor of Data Science and Data Analytics (DSDA) is a four-year, full-time programme that blends statistics, mathematics, computer science, and domain knowledge to transform raw data into actionable insights.",
    "about": "This programme is designed for students who enjoy problem-solving with mathematics, programming, and data, and who want to build data-driven products and insights for government, business, and society. It is ideal for learners seeking hands-on, project-based study in a collaborative, research-oriented environment.",
    "learning_outcomes": "- Retrieve, clean, and manage structured and unstructured data.\n- Use modern data science tools and cloud platforms for large-scale analysis.\n- Build statistical models and apply machine and deep learning for prediction and inference.\n- Design, develop, and query databases; engineer and optimise data pipelines.\n- Create clear, ethical, and audience-specific data visualisations and narratives.\n- Develop front-end and back-end components for data-driven applications.\n- Apply optimisation, econometrics, and systems thinking to real-world problems.\n- Work with natural language data and intelligent generative agents.\n- Uphold responsible AI and data governance practices.\n- Plan, deliver, and defend research and capstone projects end-to-end.\n\nTransferable Skills: critical and systems thinking, problem-solving, project management, professional communication, teamwork, ethical reasoning, and lifelong learning.",
    "teaching_assessment": "Learning is hands-on and inquiry-based, combining tutorials, workshops, and guided projects. Students use the Sherubtse Digital Studio and Data Science Lab for collaborative, real-world problem-solving and applied learning. Assessment is continuous and varied, including written assignments, practical exercises, quizzes, discussions, presentations, problem-solving tasks, portfolios, prototype designs, and project work. Major assessments—Data Science Projects I & II and the 48-credit Industry Capstone—require proposal defence, comprehensive reports (70%), and oral presentations (30%).",
    "resources": "Students have access to a dedicated Data Science Lab equipped with high-performance systems for advanced workloads and the Sherubtse Digital Studio for agile, collaborative projects. The College offers extensive library and online resources supported by campus-wide Wi-Fi, extended lab hours, collaboration rooms, and comprehensive wellbeing services.",
    "career_opportunities": "Graduates will be prepared for a range of data-driven careers such as Data Analyst, Business Intelligence Analyst, Machine Learning or AI Engineer, Data Engineer, Cloud Data Specialist, Financial or Marketing Insights Analyst, and Research or Policy Data Officer. Employment opportunities exist across government agencies, finance, healthcare, NGOs, and industries—both in Bhutan and internationally—with growing potential for remote and freelance work. Graduates will also be well-positioned for postgraduate study in data science, artificial intelligence, or statistics.",
    "curriculum": [
      {
        "label": "Year 1 – Foundations",
        "courses": "Python Programming, Statistical Computing I, Environmental & Global Economics, Project Management, Academic Research Skills, Digital Communication, Dzongkha modules, and the start of elective track courses (Entrepreneurship / Creative Public Speaking / UI&UX)."
      },
      {
        "label": "Year 2 – Deep Domain",
        "courses": "Discrete Structures for Data Science, Statistical Computing II, Data Analytics & Visualisation, Calculus and Linear Algebra for Data Science, Modern Database Design, Front-End Web Development, User Interaction Design, and elective courses."
      },
      {
        "label": "Year 3 – Deep Experiential",
        "courses": "Back-End Web Development, Artificial Intelligence & Machine Learning, Optimisation, Econometrics, Big Data, Deep Learning, Statistical Modelling & Simulation, and Data Science Project I plus elective courses."
      },
      {
        "label": "Year 4 – Deep Specialists",
        "courses": "Natural Language Processing, Ethics in AI & Data Governance, Intelligent & Generative Agents, Data Science Project II , Advanced Skills for Career Development , and the Industry Capstone Project (48 credits) with external review and certification."
      }
    ],
    "testimonials": [
      {
        "quote": "I have been at Sherubtse College for a little over two years now, enjoying every bit of what we call ‘college life’. The college teaches us to be beautiful inside and out—independent, responsible, physically active, and intellectual. Kanglung has plenty of beautiful sights and travel destinations, perfect for those looking to refresh their minds. Being part of the first cohort of a newly launched degree—Bachelor of Data Science and Data Analytics—is both exciting and nerve-wracking. Hands-on experiences, projects, AI, machine learning, and deep learning are constant buzzwords within my academic community.",
        "name": "Ranjana Sunwar",
        "detail": "Year 3, Sem I"
      },
      {
        "quote": "As part of the first DSDA cohort, I’ve gained a strong foundation in statistics, Python, and data science, while working on real-world projects that sharpen my analytical and problem-solving skills. The dedicated faculty, excellent facilities, and supportive environment have helped me grow both academically and personally. Beyond studies, I’ve enjoyed contributing through art, social service, and youth activities—making my experience at Sherubtse truly well-rounded and rewarding.",
        "name": "Manita Gurung",
        "detail": "Year 3, Sem I"
      }
    ],
    "highlights": "- Progressive design, combining broad technical literacy with deep analytical expertise.\n- A 48-credit, real-world Industry Capstone Project featuring field data collection and external review.\n- Built-in Professional Certification and an Advanced Skills for Career Development module.\n- Choice of elective tracks to develop complementary strengths: Entrepreneurship , Creative Public Speaking , or UI/UX Design .\n\nLearning supported by Sherubtse’s Digital Studio , a dedicated Data Science Lab , and a rich digital learning environment.\n\nThe DSDA programme features a 48-credit Industry Capstone anchored in real Bhutanese and sectoral data, alongside embedded professional certification to ensure industry-ready skills. Its project-centred, “T-shaped” learning model integrates the Digital Studio and Data Science Lab for authentic, hands-on experience. Students benefit from elective tracks that nurture creative and entrepreneurial growth, while small sections and strong mentorship foster academic excellence and personal wellbeing.",
    "admission_requirements": "Class XII pass with at least 50% in Maths/B.Maths.\n\nMerit-ranked on subject ability rating points (Maths/B.Maths 5, English 3, Dzongkha 3, any 2 other subjects 1). Shortlisted applicants sit the Data Visualisation Test; final selection is on the DVT merit ranking.",
    "seats": "60 government scholarship · 10 self-financed",
    "contact_email": "admission.sherubtse@rub.edu.bt",
    "contact_note": "For academic matters: Head of School – pemawangdi.sherubtse@rub.edu.bt"
  },
  "bsc-mathematics": {
    "level": "undergraduate",
    "degree_type": "BSc in Mathematics",
    "duration": "4 years",
    "overview": "The Bachelor of Science (BSc) in Mathematics at Sherubtse College is a four-year degree programme, first launched in July 2017. As Bhutan’s oldest and most reputable institution of higher learning, Sherubtse has long been committed to nurturing analytical thinkers, problem-solvers, and innovators who can meet the demands of a rapidly evolving world.\n\nWith its first programme cycle completed in 2021, the BSc in Mathematics has undergone a major curriculum review—rooted in national priorities, global academic benchmarks, and 21st-century skills—ensures the programme remains relevant, rigorous, and aligned with the needs of modern industries.",
    "short_description": "The Bachelor of Science (BSc) in Mathematics at Sherubtse College is a four-year degree programme, first launched in July 2017.",
    "curriculum": [
      {
        "label": "Year 1",
        "courses": "Semester I: Life Science, Fundamentals of Mathematics, Statistical Computing I, Dzongkha (རྫོང་ཁ་ཤེས་ཡོན་འབྲི་རྩལ), Academic Research Skills\nSemester II: Physics, Chemistry, Python Programming, Dzongkha Writing Skills (རྫོང་ཁ་རྩོམ་རིག), Elective I"
      },
      {
        "label": "Year 2",
        "courses": "Semester I: Calculus I, Geometry, Discrete Mathematics, Matrix Algebra, Elective II\nSemester II: Calculus II, Graph Theory, Number Theory, Applied Regression & ANOVA, Elective III"
      },
      {
        "label": "Year 3",
        "courses": "Semester I: Vector Calculus, Differential Equations I, Abstract Algebra, Econometrics, Elective IV\nSemester II: Differential Equations II, Operations Research, Linear Algebra, Machine Learning & Data Science, Elective V"
      },
      {
        "label": "Year 4",
        "courses": "Semester I: Numerical Analysis & Scientific Computing, Real Analysis I, Mathematical Modelling, Capstone Project I, Professional Certification\nSemester II: Real Analysis II, Complex Analysis, Capstone Project II"
      }
    ],
    "testimonials": [
      {
        "quote": "BSc in Mathematics at Sherubtse College provides an excellent foundation for higher studies such as a Master’s or PhD. I personally feel that it is the best programme for those who wish to pursue advanced studies in mathematics. In terms of faculty and facilities, we have highly qualified and experienced lecturers, and the facilities provided on campus are truly outstanding.",
        "name": "Manju Gurung",
        "detail": "BSc in Mathematics (First Batch), Class of 2020 Faculty, Department of Mathematics"
      },
      {
        "quote": "My journey with Mathematics began at Sherubtse College as part of the second batch of the BSc in Mathematics programme. To be honest, before joining, I had a narrow view of what a mathematics degree could offer. The programme was a true eye-opener, revealing a wide and fascinating array of academic paths. It was here that I got completely hooked on the subject's logic and beauty. This passion, first ignited in the classrooms of Sherubtse, guided me to pursue an MSc in Applied Mathematics at South Asian University. It is with immense pride and a deep sense of gratitude that I have now returned to my alma mater as a faculty member in 2023. The BSc in Mathematics programme didn't just educate me; it showed me my calling. I am now thrilled to embark on my career in teaching, hoping to inspire the next generation of mathematicians just as my tutors inspired me.”",
        "name": "Karma Dorji",
        "detail": "BSc in Mathematics (Second Batch), Class of 2020 Faculty, Department of Mathematics"
      }
    ],
    "highlights": "- Strong Academic Foundation: Students engage in a wide range of mathematical areas including calculus, geometry, linear algebra, abstract algebra, differential equations, graph theory, operations research, numerical analysis, real analysis, and complex analysis. The curriculum is structured to offer a clear learning progression from foundational concepts to advanced theoretical and applied mathematics.\n- Integration of Applied and Computational Mathematics: The programme incorporates Python programming, R for statistical computing, machine learning and data science, and applied regression and econometrics. Students gain hands-on experience with computational tools and real-world datasets, preparing them for interdisciplinary careers.\n- Capstone Project and Professional Certification: The final year includes Capstone Project I & II, where students work on mathematical modelling, scientific computing, or data-driven investigations, and professional certification training, equipping students with industry-recognized credentials to enhance employability.\n- Research and Scholarly Engagement: Undergraduate research is strongly encouraged. Students work closely with faculty on small-scale research, case studies, and applied projects, contributing to a vibrant academic environment.\n- Dedicated and Highly Qualified Faculty: The programme is delivered by eight faculty members with strong academic backgrounds in pure mathematics, statistics, and applied mathematics. Faculty members actively pursue research, receive advanced training, and engage in professional development to ensure high-quality instruction.",
    "key_skills": "- Advanced analytical thinking\n- Quantitative and computational skills\n- Critical reasoning and problem-solving\n- Effective communication and teamwork\n- Research and project management skills",
    "about": "Whether you aspire to become a researcher, data scientist, teacher, analyst, or academic, this programme equips you with the depth, versatility, and confidence to succeed in an increasingly quantitative world.",
    "career_opportunities": "Our alumni have excelled in diverse fields such as:\n- Education and academia\n- Data science and analytics\n- Finance and actuarial science\n- Research institutions\n- Government agencies and private organizations\n\nTracer studies reveal strong employability, high employer satisfaction, and excellent readiness for postgraduate studies in mathematics and related disciplines.",
    "teaching_assessment": "Teaching and learning include:\n- Interactive lectures\n- Lab-based sessions\n- Seminars and presentations\n- Group projects and peer collaboration\n- Project-based learning\n- Moodle-supported digital learning\n\nThis diverse approach enhances conceptual understanding, communication skills, and practical problem-solving abilities.",
    "admission_requirements": "Class XII science pass with at least 55% in Maths and 45% each in Chemistry and Physics.\n\nAbility rating points: Mathematics 5, Physics 4, Chemistry 3, English 2, any 1 other subject 1.",
    "seats": "30 government scholarship · 5 self-financed",
    "contact_email": "admission.sherubtse@rub.edu.bt"
  },
  "bsc-life-science": {
    "level": "undergraduate",
    "degree_type": "BSc in Life Science",
    "duration": "4 years (8 semesters)",
    "overview": "The Bachelor of Science in Life Sciences at Sherubtse College is a four-year undergraduate programme providing a comprehensive foundation in biological sciences. Emphasising Bhutan’s rich biodiversity, the curriculum integrates traditional biological disciplines with contemporary scientific and technological advancements. Designed in alignment with Bhutan’s national development priorities and global scientific trends, the programme equips students with the knowledge, skills, and values essential for careers in research, education, conservation, biotechnology, and interdisciplinary scientific fields. Students gain hands-on experience in laboratories, field research, and digital simulations, preparing them to address real-world challenges in life sciences and sustainable development.",
    "short_description": "The Bachelor of Science in Life Sciences at Sherubtse College is a four-year undergraduate programme providing a comprehensive foundation in biological sciences.",
    "about": "The programme is intended for students passionate about understanding living systems, ecology, and biodiversity, and who enjoy hands-on laboratory and field-based research. It is ideal for those aiming for careers in scientific research, conservation, education, biotechnology, or related fields.",
    "learning_outcomes": "- Demonstrate a strong understanding of core concepts in botany, zoology, genetics, molecular biology, and ecology.\n- Design and conduct scientific investigations using both classical and modern techniques.\n- Analyse and interpret data using quantitative reasoning, bioinformatics, and GIS tools.\n- Communicate scientific ideas clearly in oral, written, and visual formats, and collaborate effectively in teams.\n- Integrate interdisciplinary knowledge to solve real-world biological and environmental problems.\n- Apply ethical reasoning and engage responsibly with community and environmental initiatives.\n- Adapt to evolving scientific landscapes through lifelong learning, innovation, and leadership.",
    "teaching_assessment": "Teaching combines lectures, seminars, group discussions, flipped classrooms, laboratory sessions, field visits, biodiversity monitoring, and virtual simulations. Innovative digital platforms such as the Virtual Learning Environment (VLE), PhET simulations, and VR/AR support interactive and experiential learning. Assessment is balanced across formative tasks, including quizzes, lab reports, presentations, and group work, and summative evaluations such as examinations and capstone projects. Skill development is emphasised through clear learning objectives, feedback mechanisms, and rubric-based evaluations.",
    "resources": "Students have access to well-equipped laboratories and field equipment, permanent biodiversity monitoring plots (e.g., Khaling-Kharungla), advanced software and databases for bioinformatics, GIS, and molecular analysis, and national partnerships including the National Biodiversity Centre and Bhutan Biodiversity Portal. Digital learning tools and virtual labs further support applied learning.",
    "career_opportunities": "Graduates are prepared for diverse career pathways. In the government and public sector, opportunities include teaching, biodiversity officer roles, environmental analyst positions, and research assistant roles in forestry, education, and the armed forces. In the private sector and NGOs, graduates may work as environmental consultants, biotech researchers, public health specialists, or science communicators. Emerging roles include data analysts, clinical informatics specialists, policy analysts, and eco-entrepreneurs. Graduates may also pursue postgraduate studies in zoology, botany, microbiology, genetics, biotechnology, horticulture, and environmental science.",
    "curriculum": [
      {
        "label": "Programme structure",
        "courses": "The programme spans eight semesters (four years), comprising 36 modules and a final-year Capstone Project. Year 1 focuses on foundational sciences, including physics, chemistry, mathematics, computing, academic writing, and Dzongkha, alongside introductory life science concepts. Years 2 and 3 cover core biological sciences such as plant and animal diversity, developmental biology, cell biology, microbiology, biochemistry, molecular biology, and bioinformatics. Students begin elective modules and interdisciplinary studies in GIS, remote sensing, and computational biology. Year 4 emphasises advanced specialisation and independent research with modules in biotechnology, freshwater biology, ecology, immunology, and ethnobotany. Students undertake a 48-credit Capstone Project and may choose elective tracks in Entrepreneurship, UI/UX Design, Public Speaking, or Actuarial Studies."
      }
    ],
    "testimonials": [
      {
        "quote": "I am deeply grateful for the modules offered through the Life Science programme. The research skills I acquired enable me to address conservation challenges effectively and pass these competencies on as a teacher. Overall, the programme shaped me into a lifelong learner and advocate for science.",
        "name": "Tandin Dorji",
        "detail": "Graduate, 2019"
      },
      {
        "quote": "The Life Science programme spans from cells to species, offering practical skills and a comprehensive understanding of biological fundamentals. Beyond academics, it fostered resilience, curiosity, and a passion for inquiry, laying a strong foundation for my personal and professional growth.",
        "name": "Nythri Tshering",
        "detail": "Class of 2021"
      },
      {
        "quote": "Thanks to this programme, I developed a solid understanding of life sciences, giving me confidence to pursue my goals and explore different areas within the field. It is a great starting point for anyone interested in a career in life sciences.",
        "name": "Karma Sherub Wangmo",
        "detail": "Graduate, 2023"
      }
    ],
    "highlights": "The programme integrates Bhutanese biodiversity and sustainable development, offers a research-intensive final year with a 48-credit Capstone Project, and employs flexible pedagogy combining virtual and field-based learning. Interdisciplinary exposure is enhanced through elective tracks and digital tools, aligning the curriculum with national priorities in conservation, education, and scientific research.",
    "admission_requirements": "Class XII science pass with at least 55% in Biology and 45% in Chemistry.\n\nAbility rating points: Biology 5, Chemistry 4, Physics 3, English 3, any 1 other subject 1.",
    "seats": "30 government scholarship · 5 self-financed",
    "contact_email": "admission.sherubtse@rub.edu.bt"
  },
  "bsc-chemistry": {
    "level": "undergraduate",
    "degree_type": "BSc in Chemistry",
    "duration": "4 years",
    "overview": "The Bachelor of Science in Chemistry at Sherubtse College is a modern four-year undergraduate degree that provides a rigorous foundation in core chemical principles while embracing emerging and applied fields. Launched in 2017 and comprehensively reviewed in 2026, the programme is distinctive for its alignment with Bhutan’s industrial and scientific priorities. Students gain hands-on training with industry-standard instrumentation, engage in a dedicated research pathway through a capstone project, and explore contemporary topics such as green chemistry, electrochemical sensors, and data analytics using the Python programming language. This programme prepares graduates for real-world chemical problem-solving, research, and professional practice.",
    "short_description": "The Bachelor of Science in Chemistry at Sherubtse College is a modern four-year undergraduate degree that provides a rigorous foundation in core chemical principles while embracing emerging and applied fields.",
    "about": "This programme is ideal for students passionate about molecular sciences and seeking careers that combine theoretical knowledge with practical applications. It is designed for those aspiring to become industrial chemists, quality control officers, researchers, educators, or environmental consultants‒both in Bhutan and internationally. It also provides a strong foundation for advanced studies (MSc/PhD) in specialised chemical fields.",
    "learning_outcomes": "- Demonstrate expertise in core chemical disciplines, including inorganic, organic, physical, analytical, electrochemistry, and biochemistry.\n- Design and conduct experiments using modern analytical techniques and instrumentation.\n- Apply chemical principles to solve real-world problems in areas such as environmental monitoring, materials science, and medicinal chemistry.\n- Analyse and interpret complex data using statistical, computational, and Python-based tools.\n- Design, fabricate, and evaluate electrochemical sensors for diverse applications.\n- Communicate scientific findings effectively through reports, presentations, and research papers.\n- Work collaboratively and ethically in teams while applying sustainable and green chemistry practices.",
    "teaching_assessment": "Students learn through interactive lectures, problem-solving tutorials, extensive laboratory sessions, and field-based case studies. Technology-enhanced learning via Virtual Learning Environment, simulations, and data analysis software supplements hands-on experience. Guest lectures from industry professionals and visits to industrial sites provide practical insights. The final-year Capstone Project offers independent research supervised by faculty members, enabling students to conduct original investigations and report their findings. Assessment includes lab reports, quizzes, presentations, written assignments, class tests, final exams, and a formal thesis defence for the Capstone Project, ensuring a balance between skill development and academic rigour.",
    "resources": "Students have access to four fully equipped chemistry laboratories, a computational lab with molecular modelling software (e.g., Gaussian), and a forthcoming Central Instrumentation Centre housing advanced equipment such as HPLC, FTIR, ICP-OES, Raman spectroscopy, and applied electroanalytical workstations. Digital resources include access to American Chemical Society (ACS) and Royal Society of Chemistry (RSC) publications and open-access journals. National industry partnerships, including Dungsam Cement, DGPC, BPC, BAFRA, and the pharmaceutical and food industries, provide internship and collaborative project opportunities for students.",
    "career_opportunities": "Graduates are prepared for roles as industrial chemists, quality control officers, laboratory analysts, environmental consultants, teachers, police forensic officers, army officers in chemistry-related departments, research assistants, and PhD candidates. The programme also provides a strong foundation for advanced studies in chemistry and related fields globally.",
    "curriculum": [
      {
        "label": "Year 1 – Foundation in Science",
        "courses": "Focuses on building a strong scientific foundation. Core modules include Fundamentals of Chemistry, Physics, Mathematics, Life Sciences, Statistical Computing, Python Programming, and Academic Skills. Students are also introduced to Dzongkha communication and may select electives such as Public Speaking or Entrepreneurship."
      },
      {
        "label": "Year 2 – Core Chemical Disciplines",
        "courses": "Covers the foundational courses of chemistry sub-disciplines: Physical Chemistry I & II, Principles of Analytical Chemistry, Inorganic Chemistry I & II, Organic Chemistry I. Students also study Multivariate Calculus and Differential Equations and Biochemistry. Electives provide opportunities to explore interdisciplinary skills, such as UI/UX Design or Actuarial Studies."
      },
      {
        "label": "Year 3 – Advanced Chemical Studies",
        "courses": "Delivers in-depth coverage of Physical Chemistry III, Instrumental Methods of Analysis, Organic Chemistry II, and Inorganic Chemistry III. Specialised modules include Green Chemistry and Sustainable Synthesis, Phytochemistry and Natural Product Chemistry, Principles of Medicinal Chemistry, and Principles of Electrochemical Sensing. Electives continue to allow students to tailor their degree according to interest and career goals."
      },
      {
        "label": "Year 4 – Applied & Emerging Fields",
        "courses": "Focuses on applied and emerging areas of chemistry, including Organic Chemistry III, Quantum Chemistry and Molecular Spectroscopy, Industrial Chemistry and Materials, Electrochemical Sensor Design and Characterisation, Environmental Toxicology and Pollution, and Chemical Spectroscopic Methods. The year is anchored by a 48-credit Capstone Project, enabling students to conduct independent, supervised research on real-world chemical problems."
      }
    ],
    "testimonials": [
      {
        "quote": "The BSc in Chemistry programme has been a transformative journey for me. The blend of theoretical knowledge and practical exposure helped me develop strong scientific skills and critical thinking. I am grateful to my lecturers for their guidance, which has shaped both my academic and personal growth.",
        "name": "Kuenzang Choki",
        "detail": "Graduate 2024"
      },
      {
        "quote": "My journey as a BSc in Chemistry student at Sherubtse College was life-changing. The programme provided me with a strong foundation in chemistry and inspired me to think critically, remain curious, and face challenges with confidence. The passionate faculty and supportive environment made Sherubtse a place of growth and discovery.",
        "name": "Namgay Thinley",
        "detail": "Graduate 2024"
      },
      {
        "quote": "My three years in the BSc in Chemistry programme at Sherubtse College were incredibly transformative. The curriculum provided a robust academic foundation, blending a challenging curriculum with hands-on lab work, all guided by a deeply committed faculty. This rigorous training not only built my skills but also instilled a genuine passion for the subject, perfectly preparing me for a career in it. As an assistant lecturer, I now have a unique perspective on the programme’s value. The rigorous training I received as a student is directly applicable to my teaching, and it is a privilege to guide the next generation of chemists. I am grateful for the opportunity to contribute to the legacy of a programme that so effectively prepared me for my current role.",
        "name": "Tashi Dendup",
        "detail": "Graduate 2023, Assistant Lecturer"
      }
    ],
    "highlights": "- Industry-Aligned Curriculum developed with national employers to ensure graduates possess relevant skills.\n- Hands-On Research Experience through a full-year Capstone Project culminating in a thesis.\n- Modern Facilities with access to advanced instrumentation in chemistry and analytical research.\n- Focus on Emerging Fields, including electrochemical sensors, green chemistry, and Python programming.\n- Expert Faculty with PhD qualifications and industry experience guiding students throughout the programme.",
    "admission_requirements": "Class XII science pass with at least 55% in Chemistry and 45% each in Physics and Maths.\n\nAbility rating points: Chemistry 5, Physics 4, Mathematics 3, English 2, any 1 other subject 1.",
    "seats": "30 government scholarship · 5 self-financed",
    "contact_email": "admission.sherubtse@rub.edu.bt"
  },
  "bsc-physics": {
    "level": "undergraduate",
    "degree_type": "BSc in Physics",
    "duration": "4 years",
    "overview": "Discover how the universe works—from the smallest particles to the largest galaxies—while preparing to lead Bhutan’s journey in science and technology. The Bachelor of Science in Physics at Sherubtse College equips you with strong theoretical and practical foundations for careers in academia, research, public service, and industry. The programme blends rigorous coursework with computational skills, experimental practice, and research experience. The Honours option challenges high-achieving students to conduct independent research and develop leadership in science and innovation.\n\nWhat sets this programme apart is its integration of scientific excellence with GNH values-based learning . While meeting international academic standards, it remains rooted in Bhutan’s development context and Sherubtse’s vision of becoming “an internationally recognized institute in Liberal Arts and Sciences with an emphasis on GNH value-based learning.” Graduates emerge not only as competent physicists, but as ethical, socially responsible professionals dedicated to sustainable development and meaningful contribution to Bhutan and the global scientific community.",
    "short_description": "Discover how the universe works—from the smallest particles to the largest galaxies—while preparing to lead Bhutan’s journey in science and technology.",
    "about": "The B.Sc. in Physics is ideal for individuals with a deep curiosity about the natural world and a passion for problem-solving, experimentation, and critical thinking. It prepares students for careers in research, teaching, engineering, technology, and public service, as well as for postgraduate studies in physics or related disciplines. Graduates are equipped to adapt to rapid technological change while upholding ethical awareness, social responsibility, and GNH principles—qualities vital for addressing both local and global challenges.",
    "learning_outcomes": "- Apply the fundamental laws of physics—from mechanics to quantum theory—to solve complex problems systematically.\n- Conduct, analyse, and interpret experimental research with precision and critical judgment.\n- Use mathematical and computational tools to model, simulate, and explain physical phenomena.\n- Communicate scientific knowledge clearly through written reports, presentations, and discussions.\n- Design and implement experiments and electronic systems linking theory with real-world application.\n- Pursue advanced research (Honours) in fields such as solid-state physics, computational modelling, or embedded systems.\n- Approach real-world issues with scientific, analytical, and ethical reasoning aligned with national development goals.",
    "teaching_assessment": "Learning is active, collaborative, and technology-supported. Alongside lectures, you’ll engage in lab work, discussions, projects, and presentations that make physics engaging and relevant. The Virtual Learning Environment (VLE) provides access to notes, lab manuals, and assignments, while campus-wide Wi-Fi and well-equipped computer labs support research and teamwork.\n\nAssessment is continuous and varied—through experiments, assignments, presentations, and exams—allowing you to demonstrate your abilities in analytical thinking, creativity, and scientific communication.",
    "resources": "The programme offers four specialized laboratories—Electronics, Mechanics, Optics, and General Physics—where you’ll gain hands-on experience that connects theory with practical applications.",
    "career_opportunities": "Physics graduates possess highly transferable skills in analysis, computation, and technical problem-solving. In Bhutan, they work in education, renewable energy, hydropower, environmental monitoring, research, and engineering consultancies, contributing directly to national priorities in science and technology. Internationally, graduates pursue advanced studies and careers in research institutions, aerospace and space science, data science, medical physics, and high-tech industries such as semiconductors and optical systems.",
    "curriculum": [
      {
        "label": "Year 1 – Foundations",
        "courses": "Mechanics, Waves, and Practical Physics alongside Mathematics, Chemistry, and Academic Skills; introduction to computational tools."
      },
      {
        "label": "Year 2 – Classical & Modern Physics",
        "courses": "Electromagnetism, Mechanics II, Optics, Thermal and Modern Physics; programming, statistics, and electronics."
      },
      {
        "label": "Year 3 – Advanced Theory & Research",
        "courses": "Quantum, Atomic, and Solid-State Physics, Electromagnetic Theory, Nuclear Physics, and Research Methods."
      },
      {
        "label": "Year 4 – Mastery & Independent Research",
        "courses": "Advanced Mathematical and Theoretical Physics with a year-long Honours Project."
      }
    ],
    "testimonials": [
      {
        "quote": "The Physics Programme at Sherubtse has shaped both my thinking and my career. I am deeply grateful for the knowledge, guidance, and confidence it has given me.",
        "name": "Sagar Raika",
        "detail": "Class of 2024"
      },
      {
        "quote": "For me, physics is about exploring and making sense of everyday phenomena. My degree at Sherubtse deepened my understanding and connected advanced concepts to what I learned earlier. With opportunities like Gelephu Mindfulness City ahead, I truly believe we have a bright future, and I have no regrets about choosing Physics.",
        "name": "Jigme Singye",
        "detail": "Class of 2024"
      }
    ],
    "highlights": "- Bhutan’s premier science college with experienced faculty and modern laboratories\n- A balanced approach combining theory, experimentation, and computational learning\n- Opportunities for research, innovation, and postgraduate study\n- A supportive learning environment guided by GNH values",
    "admission_requirements": "Class XII science pass with at least 55% in Physics and 45% each in Maths and Chemistry.\n\nAbility rating points: Physics 5, Maths 4, Chemistry 3, English 2, any 1 other subject 1.",
    "seats": "30 government scholarship · 5 self-financed",
    "contact_email": "admission.sherubtse@rub.edu.bt"
  }
};
