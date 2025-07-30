import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, Mail } from 'lucide-react';

const TeamSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const team = [
    {
      name: 'Abhilasha',
      role: 'Co-Founder & Passionate Designer',
      image: '/team-member-1.jpg',
      bio: 'Always ready to do something new and unique by only new and crazy thinking.',
      linkedin: 'https://www.linkedin.com/in/abhilasha-sheoran',
      email: 'abhilashasheoran22cs30@gmail.com',
    },
    {
      name: 'Deeshant',
      role: 'Co-Founder & Main Tech Leader',
      image: '/team-member-2.jpg',
      bio: 'Gaining and exploring all tech areas with curiosity and collecting all informations about new Tech India.',
      linkedin: 'https://www.linkedin.com/in/deekshantsharma',
      email: 'deekshantsharma36@gmail.com',
    },
    {
      name: 'Sangram',
      role: 'Co-Founder',
      image: '/team-member-3.jpg',
      bio: 'Working as the management of all the required things handled smoothly.',
      linkedin: 'https://www.linkedin.com/in/sangram-suthar-24a00732b',
      email: 'sangramsuthar8454@gmail.com',
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            Meet the <span className="text-coral-pink">Team</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The passionate minds behind Bolo Mitra, dedicated to ending loneliness
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-mint-green/10 to-dusty-teal/10 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-coral-pink to-dusty-teal p-1 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-700 mb-2">{member.name}</h3>
                <p className="text-coral-pink font-semibold mb-4">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{member.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-coral-pink/10 hover:bg-coral-pink hover:text-white rounded-full flex items-center justify-center transition-colors duration-300">
                    <Linkedin size={18} />
                  </a>
                  <a href={`mailto:${member.email}`} className="w-10 h-10 bg-coral-pink/10 hover:bg-coral-pink hover:text-white rounded-full flex items-center justify-center transition-colors duration-300">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;