import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts, usePublicClient, useWatchContractEvent, useBalance } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { formatEther, parseAbiItem } from "viem";
import { cryptoAntsABI, eggABI, CRYPTO_ANTS_ADDRESS, EGG_ADDRESS } from "@/contracts/abis";
import { AntIcon, getPastelColor } from "@/components/AntIcon";
import { EggIcon } from "@/components/EggIcon";
import confetti from "canvas-confetti";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const { address } = useAccount();
  const [eggsToBuy, setEggsToBuy] = useState(1);
  const [runTutorial, setRunTutorial] = useState(false);
  const { data: ethBalance } = useBalance({ address });
  const [showLanding, setShowLanding] = useState(true);

  const { data: eggPrice } = useReadContract({
    address: CRYPTO_ANTS_ADDRESS,
    abi: cryptoAntsABI,
    functionName: "eggPrice",
  });

  const { data: eggBalance, refetch: refetchEggs } = useReadContract({
    address: EGG_ADDRESS,
    abi: eggABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Write hooks
  const { writeContract: buyEggs, data: buyEggsHash } = useWriteContract();
  const { writeContract: createAnt, data: createAntHash } = useWriteContract();
  const { writeContract: layEggs, data: layEggsHash } = useWriteContract();
  const { writeContract: sellAnt, data: sellAntHash } = useWriteContract();

  const { isSuccess: buySuccess } = useWaitForTransactionReceipt({ hash: buyEggsHash });
  const { isSuccess: createSuccess } = useWaitForTransactionReceipt({ hash: createAntHash });
  const { isSuccess: laySuccess } = useWaitForTransactionReceipt({ hash: layEggsHash });
  const { isSuccess: sellSuccess } = useWaitForTransactionReceipt({ hash: sellAntHash });

  // Refresh Trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Confetti Effect & Refresh
  useEffect(() => {
    if (buySuccess || createSuccess || laySuccess || sellSuccess) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0055', '#00ddff', '#00ff00', '#ffff00']
      });
      refetchEggs();
      setRefreshKey(prev => prev + 1);
    }
  }, [buySuccess, createSuccess, laySuccess, sellSuccess, refetchEggs]);

  // Start Tutorial on Login
  useEffect(() => {
    if (address) {
      const seen = localStorage.getItem(`tutorial-seen-${address}`) === "true";
      if (!seen) setRunTutorial(true);
      setShowLanding(false);
    } else {
      setRunTutorial(false);
      setShowLanding(true);
    }
  }, [address]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTutorial(false);
      if (address) {
        localStorage.setItem(`tutorial-seen-${address}`, 'true');
      }
    }
  };

  const tutorialSteps: Step[] = [
    {
      target: '.market-section',
      content: '🛒 MARKET: Buy eggs with ETH. You need eggs to create ants!',
      placement: 'top',
      disableBeacon: false,
    },
    {
      target: '.nursery-section',
      content: '🐣 NURSERY: With an egg, use this section to hatch and create a Crypto Ant.',
      placement: 'top',
      disableBeacon: false,
    },
    {
      target: '.colony-section',
      content: '🏰 COLONY: Your ants live here. They can lay eggs (risk of death) or be sold.',
      placement: 'top',
      disableBeacon: false,
    }
  ];

  // Listen for global events
  useWatchContractEvent({
    address: CRYPTO_ANTS_ADDRESS,
    abi: cryptoAntsABI,
    eventName: 'EggsBought',
    onLogs() {
      refetchEggs();
    },
  });

  useEffect(() => {
    if (buySuccess || createSuccess || laySuccess || sellSuccess) {
      refetchEggs();
    }
  }, [buySuccess, createSuccess, laySuccess, sellSuccess, refetchEggs]);

  const handleBuyEggs = () => {
    if (!eggPrice) return;
    const price = BigInt(eggsToBuy) * eggPrice;
    buyEggs({
      address: CRYPTO_ANTS_ADDRESS,
      abi: cryptoAntsABI,
      functionName: "buyEggs",
      args: [BigInt(eggsToBuy)],
      value: price,
    });
  };

  const handleLayEggs = (id: bigint) => {
    layEggs({ 
      address: CRYPTO_ANTS_ADDRESS, 
      abi: cryptoAntsABI, 
      functionName: "layEggs", 
      args: [id] 
    });
  };

  const handleSellAnt = (id: bigint) => {
    sellAnt({
      address: CRYPTO_ANTS_ADDRESS,
      abi: cryptoAntsABI,
      functionName: "sellAnt",
      args: [id]
    });
  };

  const addEggTokenToWallet = async () => {
    try {
      const wasAdded = await window.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: EGG_ADDRESS,
            symbol: 'EGG',
            decimals: 0,
            image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f95a.png',
          },
        },
      });
      if (wasAdded) {
        console.log('EGG token added to wallet!');
      }
    } catch (error) {
      console.error('Failed to add EGG token:', error);
    }
  };

  return (
    <div className="container">
      <Joyride
        steps={tutorialSteps}
        run={runTutorial}
        continuous
        showProgress={false}
        showSkipButton
        scrollToFirstStep={false}
        disableScrolling
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#00ddff',
            textColor: '#333',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
          },
          tooltip: {
            fontFamily: "'Share Tech Mono', monospace",
            borderRadius: '0px',
            border: '4px solid #000',
            boxShadow: '4px 4px 0px #000',
            fontSize: '0.9rem',
          },
          buttonNext: {
            borderRadius: '0px',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '11px',
            whiteSpace: 'nowrap',
            minWidth: '150px',
          },
          buttonBack: {
            borderRadius: '0px',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '11px',
            color: '#333',
          },
          buttonSkip: {
            borderRadius: '0px',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '11px',
          }
        }}
      />

      <header className="header sticky">
        <h1>🐜 CRYPTO ANTS</h1>
        <div className="header-actions">
          <ConnectButton />
          <div className="resources">
            <div className="resource-badge" aria-label="ETH balance">
              <span>💰</span>
              <span>{ethBalance?.formatted ? Number(ethBalance.formatted).toFixed(4) : "0.0000"} ETH</span>
            </div>
            <div className="resource-badge egg-badge" aria-label="Egg count">
              <span>🥚</span>
              <span>{eggBalance?.toString() || "0"} Eggs</span>
            </div>
          </div>
        </div>
        {address && (
          <div className="tutorial-controls">
            <button className="button" onClick={() => setRunTutorial(true)}>Review tutorial</button>
          </div>
        )}
      </header>

      {address && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>🔗 Contract Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>🥚 EGG Token (ERC20)</h3>
              <p style={{ fontSize: '0.8rem', wordBreak: 'break-all', marginBottom: '0.75rem', color: '#aaa' }}>
                {EGG_ADDRESS}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="button" style={{ fontSize: '0.6rem', padding: '0.6rem 1rem' }} onClick={addEggTokenToWallet}>
                  Add to Wallet
                </button>
                <a
                  href={`https://sepolia.etherscan.io/token/${EGG_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                  style={{ fontSize: '0.6rem', padding: '0.6rem 1rem', textDecoration: 'none' }}
                >
                  View on Etherscan
                </a>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>🐜 CryptoAnts (ERC721)</h3>
              <p style={{ fontSize: '0.8rem', wordBreak: 'break-all', marginBottom: '0.75rem', color: '#aaa' }}>
                {CRYPTO_ANTS_ADDRESS}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://sepolia.etherscan.io/address/${CRYPTO_ANTS_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                  style={{ fontSize: '0.6rem', padding: '0.6rem 1rem', textDecoration: 'none' }}
                >
                  View on Etherscan
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


      {address ? (
        <main className="main-grid">
          <div>
            <div className="card market-section">
              <h2>🥚 Market</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p>Egg Price: <span style={{ color: 'var(--accent-tertiary)' }}>{eggPrice ? formatEther(eggPrice) : "..."} ETH</span></p>
                <p>Your Eggs: <span style={{ color: 'var(--accent-secondary)', fontSize: '1.5rem' }}>{eggBalance?.toString() || "0"}</span></p>
              </div>
              <div style={{ marginTop: "1rem", display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  className="input"
                  value={eggsToBuy}
                  onChange={(e) => setEggsToBuy(Number(e.target.value))}
                />
                <button className="button" onClick={handleBuyEggs}>
                  Buy Eggs
                </button>
              </div>
              {eggPrice && eggsToBuy > 1 && (
                <p style={{ marginTop: "0.75rem" }}>Total: <span style={{ color: 'var(--accent-tertiary)' }}>{formatEther(BigInt(eggsToBuy) * eggPrice)} ETH</span></p>
              )}
            </div>

            <div className="card nursery-section">
              <h2>🐣 Nursery</h2>
              <p>You have: <span style={{ color: 'var(--accent-secondary)' }}>{eggBalance?.toString() || "0"}</span> eggs</p>
              <button
                className="button"
                disabled={!eggBalance || eggBalance.toString() === "0"}
                onClick={() => createAnt({
                  address: CRYPTO_ANTS_ADDRESS,
                  abi: cryptoAntsABI,
                  functionName: "createAnt",
                })}
              >
                Hatch New Ant
              </button>
            </div>
          </div>

          <div>
            <div className="card colony-section">
              <h2>🐜 My Colony</h2>
              <AntColony 
                userAddress={address} 
                layEggs={handleLayEggs} 
                sellAnt={handleSellAnt} 
                refreshKey={refreshKey}
                mineOnly
              />
            </div>
          </div>
        </main>
      ) : (
        <main className="center-layout">
          {showLanding && (
            <div className="modal-overlay">
              <div className="modal-card">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐜🥚👑</div>
                <h2>Welcome to the Colony</h2>
                <p>
                  <strong>Crypto Ants</strong> is a retro strategy game on the blockchain.
                </p>
                <div style={{ textAlign: 'left', display: 'inline-block', margin: '2rem 0' }}>
                  <p>1. <strong>Connect wallet</strong> to start.</p>
                  <p>2. <strong>Buy eggs</strong> in the market.</p>
                  <p>3. <strong>Hatch ants</strong> to build your colony.</p>
                  <p>4. <strong>Lay eggs</strong> to multiply (risk of death!).</p>
                </div>
                <button className="button" onClick={() => setShowLanding(false)}>OK</button>
              </div>
            </div>
          )}
          
          <div className="card center-card colony-section">
             <h2>🌍 Global Colony — All users</h2>
             <AntColony 
              layEggs={() => {}} 
              sellAnt={() => {}} 
              refreshKey={refreshKey}
              mineOnly={false}
            />
          </div>
        </main>
      )}
    </div>
  );
}

function AntColony({ 
  userAddress, 
  layEggs, 
  sellAnt,
  refreshKey,
  mineOnly = false
}: { 
  userAddress?: `0x${string}`, 
  layEggs: (id: bigint) => void, 
  sellAnt: (id: bigint) => void,
  refreshKey: number,
  mineOnly?: boolean
}) {
  const publicClient = usePublicClient();
  // Map of Ant ID -> Last Owner (for dead ants)
  const [deadAntOwners, setDeadAntOwners] = useState<Record<string, string>>({});
  const [eventTrigger, setEventTrigger] = useState(0);

  // Event Listeners
  useWatchContractEvent({
    address: CRYPTO_ANTS_ADDRESS,
    abi: cryptoAntsABI,
    eventName: 'AntCreated',
    onLogs() {
        refetchTotal();
    },
  });

  useWatchContractEvent({
    address: CRYPTO_ANTS_ADDRESS,
    abi: cryptoAntsABI,
    eventName: 'AntSold',
    onLogs() {
        refetchOwners();
        refetchMetadata();
        // Also refresh dead owners list as Sold means burned, but logic handles it
    },
  });

  useWatchContractEvent({
    address: CRYPTO_ANTS_ADDRESS,
    abi: cryptoAntsABI,
    eventName: 'EggsLaid',
    onLogs() {
        refetchMetadata();
    },
  });

  useWatchContractEvent({
    address: CRYPTO_ANTS_ADDRESS,
    abi: cryptoAntsABI,
    eventName: 'AntDied',
    onLogs() {
        refetchMetadata();
        setEventTrigger(prev => prev + 1); // Trigger log fetch
    },
  });

  // 1. Get total ants
  const { data: antsCreated, refetch: refetchTotal } = useReadContract({
    address: CRYPTO_ANTS_ADDRESS,
    abi: cryptoAntsABI,
    functionName: "getAntsCreated",
  });

  useEffect(() => {
    refetchTotal();
  }, [refreshKey, refetchTotal]);

  // 2. Fetch dead ants logs to know who owned them
  useEffect(() => {
    if (!publicClient) return;

    const fetchDeadAnts = async () => {
      try {
        const args = userAddress ? { owner: userAddress } : {};

        const logs = await publicClient.getLogs({
          address: CRYPTO_ANTS_ADDRESS,
          event: parseAbiItem('event AntDied(uint256 indexed antId, address indexed owner)'),
          args,
          fromBlock: 'earliest'
        });
        
        const mapping: Record<string, string> = {};
        logs.forEach(l => {
            if (l.args.antId && l.args.owner) {
                mapping[l.args.antId.toString()] = l.args.owner;
            }
        });
        setDeadAntOwners(mapping);
      } catch (e) {
        console.error("Failed to fetch dead ants logs", e);
      }
    };
    
    fetchDeadAnts();
  }, [userAddress, publicClient, refreshKey, eventTrigger]);

  // 3. Prepare calls for ownerOf for all ants
  const antIds = useMemo(() => {
    if (!antsCreated) return [];
    const count = Number(antsCreated);
    // Create array from 1 to count
    return Array.from({ length: count }, (_, i) => BigInt(i + 1));
  }, [antsCreated]);

  const { data: owners, refetch: refetchOwners } = useReadContracts({
    contracts: antIds.map(id => ({
      address: CRYPTO_ANTS_ADDRESS,
      abi: cryptoAntsABI,
      functionName: "ownerOf",
      args: [id],
    })),
    query: {
        enabled: antIds.length > 0
    }
  });

  useEffect(() => {
    refetchOwners();
  }, [refreshKey, refetchOwners]);

  // 4. Filter ants
    const visibleAntIds = useMemo(() => {
        if (!owners) return [];

        const all = antIds.map((id, index) => {
            const ownerResult = owners[index];
            let owner: string | undefined;

            if (ownerResult.status === "success") {
                owner = ownerResult.result as unknown as string;
            } else {
                // If ownerOf failed, check if it's in deadAntOwners
                owner = deadAntOwners[id.toString()];
            }

            return { id, owner };
        });

        // Show all ants, even if owner is unknown (e.g. Sold ants)
        return all.map(a => a.id);
    }, [owners, antIds, deadAntOwners]);

  // 5. Get metadata for visible ants
  const { data: antsMetadata, refetch: refetchMetadata } = useReadContracts({
    contracts: visibleAntIds.map(id => ({
      address: CRYPTO_ANTS_ADDRESS,
      abi: cryptoAntsABI,
      functionName: "antsMetadata",
      args: [id],
    })),
    query: {
        enabled: visibleAntIds.length > 0
    }
  });

  useEffect(() => {
    refetchMetadata();
  }, [refreshKey, refetchMetadata]);

  // Global timer for sorting
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  useEffect(() => {
      const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
      return () => clearInterval(timer);
  }, []);

  // Sort ants
  const sortedAnts = useMemo(() => {
    return visibleAntIds.map((id, index) => {
        const metadata = antsMetadata?.[index]?.result;
        let lastEggLayTime = 0;
        let totalEggsLaid = 0;
        let isAlive = true;

        if (metadata) {
             const m = metadata as any;
             lastEggLayTime = Number(m[0]);
             totalEggsLaid = Number(m[1]);
             isAlive = Boolean(m[2]);
        } else if (deadAntOwners[id.toString()]) {
            isAlive = false;
        }
        
        // Find owner for display
        let owner = deadAntOwners[id.toString()];
        if (!owner && owners) {
            const originalIndex = Number(id) - 1; 
            if (owners[originalIndex]?.status === "success") {
                owner = owners[originalIndex].result as unknown as string;
            }
        }

        // Check if ready to lay eggs
        const COOLDOWN = 600;
        const isReady = isAlive && (lastEggLayTime === 0 || (now - lastEggLayTime >= COOLDOWN));

        return { id, lastEggLayTime, totalEggsLaid, isAlive, owner, isReady };
    }).sort((a, b) => {
        // 1. Alive vs Dead
        if (a.isAlive !== b.isAlive) {
            return a.isAlive ? -1 : 1;
        }
        // 2. Active (Ready) vs Cooldown
        if (a.isReady !== b.isReady) {
            return a.isReady ? -1 : 1;
        }
        // 3. ID
        return Number(a.id - b.id);
    }).filter(a => (mineOnly ? (!!userAddress && a.owner === userAddress) : true));
  }, [visibleAntIds, antsMetadata, deadAntOwners, owners, now, userAddress, mineOnly]);

  if (!antsCreated) return <p>Loading colony data...</p>;
  if (visibleAntIds.length === 0) return <p>No ants found in the colony.</p>;

  return (
    <div className="grid">
      {sortedAnts.map(({ id, lastEggLayTime, totalEggsLaid, isAlive, owner }) => (
        <AntCard 
            key={id.toString()}
            id={id}
            lastEggLayTime={lastEggLayTime}
            totalEggsLaid={totalEggsLaid}
            isAlive={isAlive}
            layEggs={layEggs}
            sellAnt={sellAnt}
            owner={owner}
            isOwner={!!userAddress && owner === userAddress}
            globalNow={now}
        />
      ))}
    </div>
  );
}

function AntCard({
    id,
    lastEggLayTime,
    totalEggsLaid,
    isAlive,
    layEggs,
    sellAnt,
    owner,
    isOwner,
    globalNow
}: {
    id: bigint;
    lastEggLayTime: number;
    totalEggsLaid: number;
    isAlive: boolean;
    layEggs: (id: bigint) => void;
    sellAnt: (id: bigint) => void;
    owner?: string;
    isOwner?: boolean;
    globalNow: number;
}) {
    // Use globalNow to sync countdowns across cards
    const now = globalNow;

    const COOLDOWN = 600;
    const timeSinceLastLay = now - lastEggLayTime;
    const canLay = isAlive && (lastEggLayTime === 0 || timeSinceLastLay >= COOLDOWN);
    const remainingCooldown = lastEggLayTime === 0 ? 0 : (COOLDOWN - timeSinceLastLay);

    const formatCountdown = (seconds: number) => {
        if (seconds <= 0) return "0s";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    // Generate deterministic pastel color for this ant
    const antColor = useMemo(() => {
        if (!isAlive) return "#FF4444"; // Red if dead
        return getPastelColor(id);
    }, [id, isAlive]);

    return (
        <div className="ant-card">
            <h3>Ant #{id.toString()}</h3>
            <div className="ant-status">
                <div style={{ 
                    width: "50px",
                    height: "50px",
                    display: "inline-block", 
                    transform: isAlive ? "none" : "rotate(180deg)",
                    transition: "transform 0.5s"
                }}>
                    <AntIcon color={antColor} />
                </div>
                <span style={{ color: isAlive ? "var(--accent-tertiary)" : (owner ? "var(--accent-primary)" : "gray"), marginLeft: "0.5rem" }}>
                    {isAlive ? "Alive" : (owner ? "Dead" : "Sold")}
                </span>
            </div>
            {owner && !isOwner && (
                <p>Owner: <span style={{fontFamily: 'monospace', fontSize: '0.8rem'}}>{owner.slice(0, 6)}...{owner.slice(-4)}</span></p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "20px", height: "20px" }}>
                    <EggIcon />
                </div>
                Eggs laid: {totalEggsLaid}
            </div>
            
            {isOwner && isAlive && (
                <div className="actions">
                    <button 
                        className="button" 
                        disabled={!canLay}
                        onClick={() => layEggs(id)}
                        title={canLay ? "Lay eggs (10% chance of death)" : `Cooldown: ${formatCountdown(remainingCooldown)}`}
                    >
                        {canLay ? "Lay eggs" : `${formatCountdown(remainingCooldown)}`}
                    </button>
                    <button 
                        className="button delete" 
                        onClick={() => sellAnt(id)}
                        title="Sell ant for 0.004 ETH"
                    >
                        Sell
                    </button>
                </div>
            )}
        </div>
    );
}
