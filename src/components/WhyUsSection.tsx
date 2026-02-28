import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { useTeamMembers, useStatistics } from "@/hooks/use-cms-data";
import shireenPhoto from "@/assets/shireen-raza.jpg";

const WhyUsSection = ({ showHeader = true }: { showHeader?: boolean }) => {
  const { data: members } = useTeamMembers();
  const { data: stats } = useStatistics();
  const member = members?.[0];

  return (
    <section id="about" className="py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {showHeader && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
            <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">About</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground">
              {member ? `Meet ${member.name}` : "Meet Shireen Raza"}
            </h2>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <img
              src={member?.image_url || shireenPhoto}
              alt={member ? `${member.name} — Founder` : "Shireen Raza"}
              className="w-full aspect-[4/5] object-cover object-top rounded-sm mb-4"
            />
            {member?.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-300">
                <Linkedin size={20} strokeWidth={1.5} />
                <span className="font-body text-sm font-medium">Connect on LinkedIn</span>
              </a>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            {member?.bio && <p className="font-body text-sm text-muted-foreground leading-[1.9] mb-6">{member.bio}</p>}
            {member?.bio_extended && <p className="font-body text-sm text-muted-foreground leading-[1.9] mb-10">{member.bio_extended}</p>}

            <div className="grid sm:grid-cols-3 gap-8">
              {stats?.map((stat) => (
                <div key={stat.id} className="border-l-2 border-primary pl-5">
                  <p className="font-display text-3xl font-normal text-crimson mb-1">{stat.metric_value}</p>
                  <p className="font-body text-xs text-muted-foreground tracking-wide">{stat.metric_label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
