import {PieceType} from "../../model/object/piece/baseclass/Piece";

export default class ThreatStatus {
    private readonly _underThreat: boolean;
    private readonly _threatInfo?: ThreatInfo;

    constructor(underThreat:boolean, threatenedLocation:BoardLocation, threatenedPlayer: Player) {
        this._underThreat = underThreat;
        this._threatInfo = underThreat ? new ThreatInfo(threatenedLocation, threatenedPlayer) : undefined;
    }

    get underThreat():boolean {
        return this._underThreat;
    }

    get threatInfo():ThreatInfo | undefined {
        return this._threatInfo;
    }

    merge(tsArray:ThreatStatus[]) {
        for(let ts of tsArray) {
            if(ts._underThreat && ts.threatInfo) {
                for(let threat of ts.threatInfo?.threats) {
                    this._threatInfo?.addThreat(threat);
                }
            }
        }
    }

    addThreats(threats:Threat[]) {
        for(let threat of threats) {
            this._threatInfo?.addThreat(threat);
        }
    }
}

export class ThreatInfo {
    private readonly _threats: Threat[];
    private readonly _threatenedPlayer: Player;
    private readonly _threatenedLocation: BoardLocation;

    constructor(threatenedLocation:BoardLocation,checkedPlayer: Player) {
        this._threatenedLocation = threatenedLocation;
        this._threatenedPlayer = checkedPlayer;
        this._threats = [];
    }

    addThreat(threat: Threat) {
        this._threats.push(threat);
    }

    get threats():Threat[] {
        return this._threats;
    }

    get threatenedPlayer():Player {
        return this._threatenedPlayer;
    }

    get threatenedLocation():BoardLocation {
        return this._threatenedLocation;
    }
}

export class Threat {
    private readonly _threatLocation: BoardLocation; // location of the piece threatening king
    private readonly _threatType: PieceType;
    private readonly _threatPath: BoardLocation[]; // excludes endpoints(threat and king locations)

    constructor(threatLocation: BoardLocation, threatType: PieceType, threatPath: BoardLocation[]) {
        this._threatLocation = threatLocation;
        this._threatType = threatType;
        this._threatPath = threatPath;
    }

    get threatPath():BoardLocation[] {
        return this._threatPath;
    }

    get threatLocation():BoardLocation {
        return this._threatLocation;
    }

    get threatType():PieceType {
        return this._threatType;
    }
}